FROM ubuntu:12.04


LABEL name="action-connect-vpn"

RUN apt-get update && \
    apt-get -y install sudo && \
    sudo apt-get install openvpn=2.4.4-2ubuntu1.3 -y

COPY entrypoint.sh ./

ENTRYPOINT ["sh","/entrypoint.sh" ]