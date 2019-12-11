FROM alpine:latest

LABEL name="action-connect-vpn"

RUN apt-get update && apt-get install -y
RUN apt-get install openvpn

COPY . .

ENTRYPOINT ["sh","/entrypoint.sh" ]