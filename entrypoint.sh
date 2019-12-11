#!/bin/bash

set -eu

create_file() {
  echo $1 |base64 -d > $2
  set_permission $2
}

set_permission() {
  chmod 777 $1
}

if [ -z "$CA_CRT" ]
then
  echo "Set the CA_CRT env variable."
  exit 1
fi

if [ -z "$USER_CRT" ]
then
  echo "Set the USER_CRT env variable."
  exit 1
fi

if [ -z "$USER_KEY" ]
then
  echo "Set the USER_KEY env variable."
  exit 1
fi

if [ -z "$INPUT_DEST_VPN" ]
then
  echo "Set the DEST_VPN with variable."
  exit 1
fi

if [ -z "$INPUT_NAME_VPN" ]
then
  echo "Set the NAME_VPN with variable."
  exit 1
fi

if [ -z "$INPUT_PING_URL" ]
then
  echo "Set the PING_URL with variable."
  exit 1
fi

if [ "$INPUT_SECRET" != "" ]
then
    create_file $INPUT_SECRET $INPUT_DEST_VPN/secret.txt
fi

if [ "$INPUT_TLS_KEY" != "" ]
then
    create_file $INPUT_TLS_KEY $INPUT_DEST_VPN/tls.key
fi

create_file $CA_CRT $INPUT_DEST_VPN/ca.crt
create_file $USER_CRT $INPUT_DEST_VPN/user.crt
create_file $USER_KEY $INPUT_DEST_VPN/user.key

cd $INPUT_DEST_VPN
echo 'Starting...'
sudo openvpn --config $INPUT_NAME_VPN --daemon

ping -c5 $INPUT_PING_URL

while true; do
  ping -c5 $INPUT_PING_URL
  if [ $? -eq 0 ]
  then
    echo 'connect success'
    exit 0
  fi
done