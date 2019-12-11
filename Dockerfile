FROM alpine:latest

LABEL name="action-connect-vpn"

COPY entrypoint.sh ./

ENTRYPOINT ["sh","/entrypoint.sh" ]