# <center>Actions Connect Open VPN</center>

This action is a connect ovpn script

## Inputs

### `FILE_OVPN`, `PING_URL`

**Required** Location file open vpn and url for check success or fail.

### `CA_CRT`, `USER_CRT`, `USER_KEY`

**Required** Certificate, User cert and User key for access vpn.
`(Please encode base 64 before set secret in github secret.)`
[How to encode base 64 ?](https://www.base64encode.org/)

### `USERNAME` and `PASSWORD`

**Optional** Username and password for access vpn.

### `TLS_KEY`

**Optional** Tls-crypt for access vpn.
`(Please encode base 64 before set secret in github secret.)`
[How to encode base 64 ?](https://www.base64encode.org/)

## Outputs

### `STATUS`

**Boolean** Can get status after connect `true` or `false`.

## Example usage

```yml
- name: Install Open VPN
  run: sudo apt-get install openvpn
- name: Connect VPN
  uses: golfzaptw/action-connect-ovpn@master
  id: connect_vpn
  with:
    PING_URL: '127.0.0.1'
    FILE_OVPN: 'config.ovpn'
    CA_CRT: ${{ secrets.CA_CRT}}
    USER_CRT: ${{ secrets.USER_CRT }}
    USER_KEY: ${{ secrets.USER_KEY }}
    USERNAME: ${{ secrets.USERNAME }}
    PASSWORD: ${{ secrets.PASSWORD }}
    TLS_KEY: ${{ secrets.TLS_KEY }}
- name: Check Connect VPN
  run: echo ${{ steps.connect_vpn.outputs.STATUS }}
```
