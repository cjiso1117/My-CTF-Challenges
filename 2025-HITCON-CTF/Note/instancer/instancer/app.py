import hashlib
import json
import logging
import os
import re
import secrets
import socket
import sqlite3
import subprocess
import urllib.error
from threading import Thread
from time import sleep, time
from urllib.request import Request, urlopen

from flask import (
    Flask,
    Response,
    g,
    redirect,
    render_template,
    request,
    session,
    url_for,
)

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET", secrets.token_urlsafe())
SCOREBOARD_URL = os.environ.get(
    "SCOREBOARD_URL", "https://scoreboardbeta.hitconctf.com"
)
app.logger.setLevel(logging.INFO)
app.logger.info(f"Secret key: {app.secret_key}")

with open("config.json") as f:
    app.config.update(json.load(f))

web_services = {
    key: service
    for key, service in app.config["services"].items()
    if service["mode"].lower() == "web"
}

for service in app.config["services"].values():
    app.logger.info(f"Build images for {service['name']}...")
    subprocess.run(["docker", "compose", "build"], cwd=service["dir"])


def get_free_port(base_port=None):
    # if not base_port, get a random port
    if base_port is None:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.bind(("localhost", 0))
        port = s.getsockname()[1]
        s.close()
        return port

    while True:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            s.bind(("localhost", base_port))
            s.close()
            return base_port
        except OSError:
            base_port += 1


def db():
    db = getattr(g, "_database", None)
    if db is None:
        db = g._database = sqlite3.connect("db.sqlite3")
    return db


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, "_database", None)
    if db is not None:
        db.close()


@app.before_request
def reverse_proxy():
    if not app.config["reverse_proxy"]:
        return
    if request.host == app.config["instancer_host"]:
        return
    instancer_url = f"http://{config['instancer_host']}/"

    # iterate over services to check if the request is for a service
    for service in web_services.values():
        if service["mode"].lower() != "web":
            continue
        service_re = re.compile(
            service["host"]
            .replace(".", r"\.")
            .replace("{instance_id}", r"(?P<instance_id>.+)")
        )
        match = service_re.match(request.host)
        if not match:
            continue
        instance_id = match.group("instance_id")
        port = (
            db()
            .execute("SELECT port FROM instances WHERE instance_id = ?", (instance_id,))
            .fetchone()
        )

        if not port:
            return redirect(instancer_url)

        (port,) = port
        url = f"http://127.0.0.1:{port}{request.full_path}"
        req = Request(
            url,
            data=request.get_data(),
            headers=dict(request.headers),
            method=request.method,
        )
        try:
            with urlopen(req) as res:
                headers = dict(res.headers)
                return Response(res.read(), status=res.status, headers=headers)
        except urllib.error.HTTPError as e:
            return Response(e.read(), status=e.code, headers=dict(e.headers))
        except urllib.error.URLError as e:
            return Response(str(e), status=500)

    return redirect(instancer_url)


@app.route("/")
def index():
    source_ip = request.headers.get(
        "X-Real-IP", request.remote_addr
    )  # assuming a reverse proxy is used
    if source_ip is None:
        return "Invalid request"
    instances = (
        db()
        .execute(
            "SELECT service, instance_id, port, created_at FROM instances WHERE team_id = ?",
            (session.get("team_id"),),
        )
        .fetchall()
    )
    if instances:
        created_at = min(instance[3] for instance in instances)
        return render_template(
            "index.html",
            instances={
                srv_id: (instance_id, port)
                for srv_id, instance_id, port, _ in instances
            },
            created_at=created_at,
            source_ip=source_ip,
        )
    return render_template("index.html", source_ip=source_ip)


@app.route("/create", methods=["POST"])
def create():
    token = request.form.get("token")
    if not token:
        return redirect(url_for("index"))

    team_id = None
    # admin bypass
    if token.startswith(app.secret_key):
        try:
            team_id = int(token[len(app.secret_key) :])
        except ValueError:
            pass

    # otherwise, get team_id from the scoreboard
    if team_id is None:
        try:
            team_id = json.loads(
                urlopen(
                    Request(
                        f"{SCOREBOARD_URL}/team/token_auth?token={token}",
                        headers={"User-Agent": "Instancer"},
                    )
                ).read()
            ).get("id")
        except Exception as e:
            app.logger.error(e.read())
    if team_id is None:
        return "<b>Invalid token</b>"

    session["team_id"] = team_id

    # if already spawned, no need to spawn again
    if (
        db()
        .execute("SELECT team_id FROM instances WHERE team_id = ?", (team_id,))
        .fetchone()
    ):
        return redirect(url_for("index"))

    source_ip = request.headers.get(
        "X-Real-IP", request.remote_addr
    )  # assuming a reverse proxy is used
    if source_ip is None:
        return "Invalid request"

    # spawn instance
    for srv_id, service in app.config["services"].items():
        _key = f"{team_id}.{token}.{app.secret_key}{srv_id}".encode()
        instance_id = hashlib.sha256(_key).hexdigest()[:16]

        base_port = service.get("base_port")
        if base_port is None:
            port = get_free_port()
        else:
            port = get_free_port(base_port + team_id)
        db().execute(
            "INSERT INTO instances VALUES (?, ?, ?, ?, ?, ?)",
            (team_id, srv_id, instance_id, port, int(time()), source_ip),
        )
        if app.config["iptables"]:
            proc = subprocess.run(
                [
                    "iptables",
                    "-I",
                    "DOCKER-USER",
                    "-s",
                    source_ip,
                    "-p",
                    "tcp",
                    "-m",
                    "conntrack",
                    "--ctorigdstport",
                    str(port),
                    "--ctdir",
                    "ORIGINAL",
                    "-j",
                    "ACCEPT",
                ]
            )

            if proc.returncode != 0:
                app.logger.error(proc.stderr)
                return f"Failed to spawn instance for {service['name']}: {proc.stderr}"

        proc = subprocess.run(
            [
                "docker",
                "compose",
                "--project-name",
                f"{srv_id}-team-{team_id}-{instance_id}",
                "up",
                "--detach",
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=dict(os.environ, PORT=str(port)),
            cwd=service["dir"],
        )

        if proc.returncode != 0:
            app.logger.error(proc.stderr)
            return f"Failed to spawn instance for {service['name']}: {proc.stderr}"
    db().commit()

    return redirect(url_for("index"))


@app.route("/stop", methods=["POST"])
def stop():
    team_id = session.get("team_id")
    if not team_id:
        return redirect(url_for("index"))

    for srv_id, service in app.config["services"].items():
        res = (
            db()
            .execute(
                "SELECT instance_id, port, source_ip FROM instances WHERE team_id = ? AND service = ?",
                (team_id, srv_id),
            )
            .fetchone()
        )
        if not res:
            continue

        instance_id, port, source_ip = res

        if app.config["iptables"]:
            subprocess.run(
                [
                    "iptables",
                    "-D",
                    "DOCKER-USER",
                    "-s",
                    source_ip,
                    "-p",
                    "tcp",
                    "-m",
                    "conntrack",
                    "--ctorigdstport",
                    str(port),
                    "--ctdir",
                    "ORIGINAL",
                    "-j",
                    "ACCEPT",
                ]
            )

        subprocess.run(
            [
                "docker",
                "compose",
                "--project-name",
                f"{srv_id}-team-{team_id}-{instance_id}",
                "down",
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=dict(os.environ, PORT=str(port)),
            cwd=service["dir"],
        )
        db().execute("DELETE FROM instances WHERE instance_id = ?", (instance_id,))
        db().commit()

    return redirect(url_for("index"))


def init_db():
    conn = sqlite3.connect("db.sqlite3")
    c = conn.cursor()
    # (team_id, service) should be unique
    c.execute(
        """
        CREATE TABLE IF NOT EXISTS instances (
            team_id INTEGER,
            service TEXT,
            instance_id TEXT PRIMARY KEY,
            port INTEGER,
            created_at INTEGER,
            source_ip TEXT,
            UNIQUE(team_id, service)
        )
    """
    )
    conn.commit()
    conn.close()


def update():
    conn = sqlite3.connect("db.sqlite3")
    c = conn.cursor()
    while True:
        try:
            # stop instances that are running for more than STOP_AFTER
            now = int(time())
            expired = c.execute(
                "SELECT service, instance_id, team_id, port, source_ip FROM instances WHERE ? - created_at > ?",
                (now, app.config["stop_after"]),
            ).fetchall()
            for srv_id, instance_id, team_id, port, source_ip in expired:
                subprocess.run(
                    [
                        "iptables",
                        "-D",
                        "DOCKER-USER",
                        "-s",
                        source_ip,
                        "-p",
                        "tcp",
                        "-m",
                        "conntrack",
                        "--ctorigdstport",
                        str(port),
                        "--ctdir",
                        "ORIGINAL",
                        "-j",
                        "ACCEPT",
                    ]
                )
                subprocess.run(
                    [
                        "docker",
                        "compose",
                        "--project-name",
                        f"{srv_id}-team-{team_id}-{instance_id}",
                        "down",
                    ],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    env=dict(os.environ, PORT=str(port)),
                    cwd=app.config["services"][srv_id]["dir"],
                )
                c.execute("DELETE FROM instances WHERE instance_id = ?", (instance_id,))
            conn.commit()
        except Exception as e:
            app.logger.error("Error in update:", e)
            pass
        sleep(1)
    conn.close()


Thread(target=update, daemon=True).start()
init_db()
