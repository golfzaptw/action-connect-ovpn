FROM ubuntu:12.04


LABEL name="action-connect-vpn"

RUN apt-get update && \
    apt-get -y install sudo && \
    apt-get install openvpn

COPY entrypoint.sh ./

ENTRYPOINT ["sh","/entrypoint.sh" ]