#!/bin/bash

set -eu

create_file() {
  echo $1 |base64 -d > $2
}

add_permission() {
  chmod +x $1
}

connect_vpn() {
    cd $1
    openvpn --config config.ovpn --daemon

while true; do
  ping -c1 $2
  if [ $? -eq 0 ] 
  then
    echo 'connect success'
    exit 0
  fi
done
}

if [[ -z "$CA_CRT" ]]; then
  echo "Set the CA_CRT env variable."
  exit 1
fi

if [[ -z "$USER_CRT" ]]; then
  echo "Set the CA_CRT env variable."
  exit 1
fi

if [[ -z "$USER_KEY" ]]; then
  echo "Set the CA_CRT env variable."
  exit 1
fi

if [[ "$INPUT_FILE_OVPN" == "" ]]; then
  echo "Set the FILE_OVPN with variable."
  exit 1
fi

if [[ "$INPUT_PING_URL" == "" ]]; then
  echo "Set the PING_URL with variable."
  exit 1
fi

if [[ "$INPUT_SECRET" != "" ]]; then
    create_file $INPUT_SECRET $INPUT_FILE_OVPN/secret.txt
    add_permission $INPUT_FILE_OVPN/secret.txt
fi

if [[ "$INPUT_TLS_KEY" != "" ]]; then
    create_file $INPUT_TLS_KEY $INPUT_FILE_OVPN/tls.key
    add_permission $INPUT_FILE_OVPN/tls.key
fi

create_file $CA_CRT $INPUT_FILE_OVPN/ca.crt
create_file $USER_CRT $INPUT_FILE_OVPN/user.crt
create_file $USER_KEY $INPUT_FILE_OVPN/user.key

add_permission $INPUT_FILE_OVPN/ca.crt
add_permission $INPUT_FILE_OVPN/user.crt
add_permission $INPUT_FILE_OVPN/user.key
add_permission $INPUT_FILE_OVPN/config.ovpn

connect_vpn $INPUT_FILE_OVPN $INPUT_PING_URL