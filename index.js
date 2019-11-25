const path = require('path')
// const shell = require('shelljs')
const ping = require('ping')
const childProcess = require('child_process')
// GITHUB
const core = require('@actions/core')

try {
  // Get input defined in action metadata file
  const pingURL = core.getInput('PING_URL')
  const fileOVPN = core.getInput('FILE_OVPN')
  const secret = 'dsdsds'
  const tlsKey = core.getInput('TLS_KEY')

  const finalPath = path.resolve(process.cwd(), fileOVPN)

  const createFile = (filename, data) => {
    childProcess.exec(`echo ${data} | base64 -d >> ${filename}`, res => {
      if (res.code !== 0) {
        core.setFailed(`Can't create ${filename}`)
        process.exit(1)
      }
    })
    childProcess.exec(`chmod 600 ${filename}`, res => {
      if (res.code !== 0) {
        core.setFailed(`Can't add permission ${filename}`)
        process.exit(1)
      }
    })
  }

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

  if (secret !== '') {
    createFile('secret.txt', secret)
  }
  if (tlsKey !== '') {
    createFile('tls.key', tlsKey)
  }
  createFile('ca.crt', process.env.CA_CRT)
  createFile('user.crt', process.env.USER_CRT)
  createFile('user.key', process.env.USER_KEY)

  childProcess.exec(`sudo openvpn --config ${finalPath} --daemon`, res => {
    if (res.code !== 0) {
      core.setFailed(`Can't setup config ovpn`)
      process.exit(1)
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
