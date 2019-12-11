FROM ubuntu:16.04

LABEL name="action-connect-vpn"

RUN apt-get update && \
    apt-get -y install sudo iputils-ping && \
    apt-get -y install openvpn && \
    mkdir -p /dev/net && \
    mknod /dev/net/tun c 10 200 && \
    chmod 600 /dev/net/tun 

COPY entrypoint.sh ./

ENTRYPOINT ["sh","/entrypoint.sh" ]