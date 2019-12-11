FROM alpine:latest

LABEL name="action-connect-vpn"

RUN apk update && apk add -y && apk add openvpn

COPY . .

ENTRYPOINT ["sh","/entrypoint.sh" ]