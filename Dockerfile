FROM ubuntu:18.04


LABEL name="action-connect-vpn"

RUN apt-get update && \
    apt-get -y install sudo && \
    sudo apt-get install openvpn -y && \
    apt-get install iputils-ping -y && \
    mkdir -p /dev/net && \
    mknod /dev/net/tun c 10 200 && \
    chmod 600 /dev/net/tun

COPY entrypoint.sh ./

ENTRYPOINT ["sh","/entrypoint.sh" ]