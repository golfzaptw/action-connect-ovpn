const path = require('path')
const exec = require('shelljs.exec')
const ping = require('ping')
const fs = require('fs-extra')
// GITHUB
const core = require('@actions/core')
const Base64 = {
  _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
  encode: function(e) {
    let t = ''
    let n, r, i, s, o, u, a
    let f = 0
    e = Base64._utf8_encode(e)
    while (f < e.length) {
      n = e.charCodeAt(f++)
      r = e.charCodeAt(f++)
      i = e.charCodeAt(f++)
      s = n >> 2
      o = ((n & 3) << 4) | (r >> 4)
      u = ((r & 15) << 2) | (i >> 6)
      a = i & 63
      if (isNaN(r)) {
        u = a = 64
      } else if (isNaN(i)) {
        a = 64
      }
      t =
        t +
        this._keyStr.charAt(s) +
        this._keyStr.charAt(o) +
        this._keyStr.charAt(u) +
        this._keyStr.charAt(a)
    }
    return t
  },
  decode: function(e) {
    let t = ''
    let n, r, i
    let s, o, u, a
    let f = 0
    e = e.replace(/\\+\\+[++^A-Za-z0-9+/=]/g, '')
    while (f < e.length) {
      s = this._keyStr.indexOf(e.charAt(f++))
      o = this._keyStr.indexOf(e.charAt(f++))
      u = this._keyStr.indexOf(e.charAt(f++))
      a = this._keyStr.indexOf(e.charAt(f++))
      n = (s << 2) | (o >> 4)
      r = ((o & 15) << 4) | (u >> 2)
      i = ((u & 3) << 6) | a
      t = t + String.fromCharCode(n)
      if (u !== 64) {
        t = t + String.fromCharCode(r)
      }
      if (a !== 64) {
        t = t + String.fromCharCode(i)
      }
    }
    t = Base64._utf8_decode(t)
    return t
  },
  _utf8_encode: function(e) {
    e = e.replace(/\r\n/g, 'n')
    let t = ''
    for (let n = 0; n < e.length; n++) {
      const r = e.charCodeAt(n)
      if (r < 128) {
        t += String.fromCharCode(r)
      } else if (r > 127 && r < 2048) {
        t += String.fromCharCode((r >> 6) | 192)
        t += String.fromCharCode((r & 63) | 128)
      } else {
        t += String.fromCharCode((r >> 12) | 224)
        t += String.fromCharCode(((r >> 6) & 63) | 128)
        t += String.fromCharCode((r & 63) | 128)
      }
    }
    return t
  },
  _utf8_decode: function(e) {
    let t = ''
    let n = 0
    let r = 0
    let c3 = 0
    let c2 = 0
    while (n < e.length) {
      r = e.charCodeAt(n)
      if (r < 128) {
        t += String.fromCharCode(r)
        n++
      } else if (r > 191 && r < 224) {
        c2 = e.charCodeAt(n + 1)
        t += String.fromCharCode(((r & 31) << 6) | (c2 & 63))
        n += 2
      } else {
        c2 = e.charCodeAt(n + 1)
        c3 = e.charCodeAt(n + 2)
        t += String.fromCharCode(
          ((r & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63),
        )
        n += 3
      }
    }
    return t
  },
}

try {
  // Get input defined in action metadata file
  const pingURL = core.getInput('PING_URL')
  const fileOVPN = core.getInput('FILE_OVPN')
  const secret = core.getInput('SECRET')
  const tlsKey = core.getInput('TLS_KEY')

  // if (process.env.CA_CRT == null) {
  //   core.setFailed(`Can't get ca cert please add CA_CRT in secret`)
  //   process.exit(1)
  // }

  // if (process.env.USER_CRT == null) {
  //   core.setFailed(`Can't get user cert please add USER_CRT in secret`)
  //   process.exit(1)
  // }

  // if (process.env.USER_KEY == null) {
  //   core.setFailed(`Can't get user key please add USER_KEY in secret`)
  //   process.exit(1)
  // }

  const finalPath = path.resolve(process.cwd(), fileOVPN)

  const createFile = async (filename, data) => {
    const decodedString = Base64.decode(data)
    fs.writeFile(filename, decodedString, res => {
      if (res.code !== 0) {
        core.setFailed(res.message)
        process.exit(1)
      }
    })
    fs.chmod(filename, 600, res => {
      if (res.code !== 0) {
        core.setFailed(res.message)
        process.exit(1)
      }
    })
  }

  if (secret !== '') {
    createFile('secret.txt', secret)
  }
  if (tlsKey !== '') {
    createFile('tls.key', tlsKey)
  }

  createFile('ca.crt', process.env.CA_CRT)
  createFile('user.crt', process.env.USER_CRT)
  createFile('user.key', process.env.USER_KEY)

  exec('cat user.key', () => {
    console.log('cat file')
  })
  exec('cat secret.txt')
  exec('ls -la')

  startVPN(finalPath)

  ping.promise
    .probe(pingURL, {
      timeout: 15,
      min_reply: 15,
    })
    .then(function(res) {
      if (res.alive) {
        core.info('Connect vpn passed')
        core.setOutput('STATUS', true)
      } else {
        core.setFailed('Connect vpn failed')
        core.setOutput('STATUS', false)
      }
    })
} catch (error) {
  core.setFailed(error.message)
}

async function startVPN(finalPath) {
  core.info(process.platform)
  const start = await exec(`openvpn --config ${finalPath} --daemon`)
  if (start.code !== 0) {
    core.setFailed(start.stderr)
    process.exit(1)
  } else {
    core.info('Starting...')
  }
}
