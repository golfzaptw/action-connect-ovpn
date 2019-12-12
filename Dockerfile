FROM ubuntu:16.04

LABEL name="action-connect-vpn"

RUN apt-get update && \
    apt-get -y install sudo iputils-ping && \
    apt-get -y install openvpn

ARG cap-add=NET_ADMIN
ARG device=/dev/net/tun

COPY entrypoint.sh ./

ENTRYPOINT ["sh","/entrypoint.sh" ]