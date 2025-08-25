FROM python:3.13-alpine

RUN apk add --no-cache docker-cli docker-cli-compose tini iptables
RUN pip install flask gunicorn
WORKDIR /instancer

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["sh", "-c", "gunicorn -b 0.0.0.0:$PORT app:app"]
