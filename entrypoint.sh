#!/bin/bash

set -eu

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

if [[ "$INPUT_SECRET" != "" ]]; then
  echo $INPUT_SECRET |base64 -d > secret.txt
fi

if [[ "$INPUT_TLS_KEY" != "" ]]; then
  echo $INPUT_TLS_KEY |base64 -d > tls.key
fi

echo $CA_CRT |base64 -d > ca.crt
echo $USER_CRT |base64 -d > user.crt
echo $USER_KEY |base64 -d > user.key

if [ "$INPUT_FILE_OVPN" == "" ]
then
  echo "Set the FILE_OVPN env variable."
  exit 1
else
  openvpn --config $INPUT_FILE_OVPN --daemon
fi

if [[ "$INPUT_PING_URL" == "" ]]; then
  echo "Set the PING_URL env variable."
  exit 1
fi

while true;
do
ping -c1 $INPUT_PING_URL
if [ $? -eq 0 ]
then
    echo 'connect success'
    exit 0
fi
done