FROM alpine:latest

LABEL name="action-connect-vpn"

RUN apk update && apk add openvpn

COPY . .

ENTRYPOINT ["sh","/entrypoint.sh" ]