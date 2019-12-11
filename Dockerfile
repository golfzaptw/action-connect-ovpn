FROM ubuntu:18.04


LABEL name="action-connect-vpn"

RUN apt-get update && \
    apt-get -y install sudo && \
    sudo apt-get install openvpn -y

COPY entrypoint.sh ./

ENTRYPOINT ["sh","/entrypoint.sh" ]