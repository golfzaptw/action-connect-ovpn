FROM alpine:latest

RUN apk add --update openvpn

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["sh","/entrypoint.sh" ]