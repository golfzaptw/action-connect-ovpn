#!/usr/bin/env bash

set -eu

while true; do
  ping -c1 $INPUT_PING_URL
  if [[ $? -eq 0 ]]; then
    echo 'connect success'
    exit 0
  fi
done