FROM alpine:latest
RUN apk add --update --no-cache openvpn

# Copy logic

COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["sh","/entrypoint.sh" ]