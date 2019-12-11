FROM alpine:latest

LABEL name="action-connect-vpn"

RUN apk add --update openvpn

COPY . .

ENTRYPOINT ["sh","/entrypoint.sh" ]