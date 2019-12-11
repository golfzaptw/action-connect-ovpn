FROM ubuntu:12.04


LABEL name="action-connect-vpn"

RUN apt-get update && \
    apt-get -y install sudo && \
    sudo apt-get install openvpn -y

RUN apt-cache policy openvpn
COPY entrypoint.sh ./

ENTRYPOINT ["sh","/entrypoint.sh" ]