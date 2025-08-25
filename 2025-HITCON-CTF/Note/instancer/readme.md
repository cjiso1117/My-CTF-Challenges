# usage

設定部分主要在 `docker-compose.yml` 以及 `instancer/config.json` 中，設定好直接 `docker compose up -d` 即可啟動。

# nginx

除了啟動 instancer，還要在 docker 外面的 nginx 設定 reverse proxy 到 3000 port 的 instancer:

```nginx
server {
    listen 80;
    server_name NAME.chal.hitconctf.com;

    return 307 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name NAME.chal.hitconctf.com;

    ssl_certificate /path/to/certs/fullchain1.pem;
    ssl_certificate_key /path/to/certs/privkey1.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

# iptables

需要把 `config.json` 中的 `iptables` 設定為 `true`，instancer 才會自動控制防火牆規則。

## basic rules

為了做基於 ip 的 access control，需要在 docker 外面做以下的 iptables 設定:

allow all traffic from localhost to port 30000-32000
but drop all traffic from other ip to port 30000-32000

```bash
sudo iptables -I DOCKER-USER -s 127.0.0.1 -p tcp -m conntrack --ctorigdstport 30000:32000 --ctdir ORIGINAL -j ACCEPT
sudo iptables -I DOCKER-USER -p tcp -m conntrack --ctorigdstport 30000:32000 --ctdir ORIGINAL -j DROP
```

## allow specific ip to access specific port

以下是用於允許特定 IP 存取特定 port 的 iptables 規則範例，供測試用:

```bash
sudo iptables -I DOCKER-USER -s $ip -p tcp -m conntrack --ctorigdstport $port --ctdir ORIGINAL -j ACCEPT
```
