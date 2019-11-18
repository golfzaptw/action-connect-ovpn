# <center>Actions Connect Open VPN</center>

This action is a connect ovpn script

## Inputs

### `USERNAME` and `PASSWORD`

**Optional** Username and password for access vpn.

### `TLS_KEY`

**Optional** Tls-crypt for access vpn.

### `FILE_OVPN`, `PING_URL`

**Required** Location file open vpn and url for check success or fail.

### `CA_CRT`, `USER_CRT`, `USER_KEY`

**Required** Certificate, User cert and User key for access vpn.

## Outputs

### `STATUS`

**Boolean** Can get status after connect `true` or `false`.

## Example usage

```yml
- name: Install Open VPN
  run: sudo apt-get install openvpn
- name: Connect VPN
  uses: golfzaptw/action-connect-ovpn
  id: connect_vpn
  with:
    PING_URL: "127.0.0.1"
    TLS_KEY: ${{ secrets.TLS_KEY }}
    CA_CRT: ${{ secrets.CA_CRT}}
    USER_CRT: ${{ secrets.USER_CRT }}
    USER_KEY: ${{ secrets.USER_KEY }}
    FILE_OVPN: "config.ovpn"
```
