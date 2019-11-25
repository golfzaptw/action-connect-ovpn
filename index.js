const path = require('path')
// const shell = require('shelljs')
const ping = require('ping')
const exec = require('child_process').exec
// GITHUB
const core = require('@actions/core')

try {
  // Get input defined in action metadata file
  const pingURL = core.getInput('PING_URL')
  const fileOVPN = core.getInput('FILE_OVPN')
  const secret = core.getInput('SECRET_ACCESS')
  const tlsKey = core.getInput('TLS_KEY')

  if (process.env.CA_CRT == null) {
    core.setFailed(`Can't get ca cert please add CA_CRT in secret`)
    process.exit(1)
  }

  if (process.env.USER_CRT == null) {
    core.setFailed(`Can't get user cert please add USER_CRT in secret`)
    process.exit(1)
  }

  if (process.env.USER_KEY == null) {
    core.setFailed(`Can't get user key please add USER_KEY in secret`)
    process.exit(1)
  }

  const finalPath = path.resolve(process.cwd(), fileOVPN)

  const createFile = (filename, data) => {
    exec('echo ' + data + ' | base64 -d >> ' + filename, err => {
      if (err !== null) {
        console.log('exec error: ' + err)
      }
    })
    exec('chmod 600 ' + filename, err => {
      if (err !== null) {
        console.log('exec error: ' + err)
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

  exec(`sudo openvpn --config ${finalPath} --daemon`, err => {
    if (err !== null) {
      console.log('exec error: ' + err)
    }
  })

  ping.promise
    .probe(pingURL, {
      timeout: 5,
      min_reply: 5,
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
