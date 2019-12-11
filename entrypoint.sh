#!/bin/bash

set -eu

create_file() {
  echo $1 |base64 -d > $2
}

add_permission() {
  chmod +x $1
}

connect_vpn() {
openvpn --config $1 --daemon

while true; do
  ping -c1 $2
  if [[ $? -eq 0 ]]; then
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
    create_file $INPUT_SECRET secret.txt
    add_permission secret.txt
fi

if [[ "$INPUT_TLS_KEY" != "" ]]; then
    create_file $INPUT_TLS_KEY tls.key
    add_permission tls.key
fi

create_file $CA_CRT ca.crt
create_file $USER_CRT user.crt
create_file $USER_KEY user.key

add_permission ca.crt
add_permission user.crt
add_permission user.key

connect_vpn $INPUT_FILE_OVPN $INPUT_PING_URL