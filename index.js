const path = require('path')
const exec = require('shelljs.exec')
const ping = require('ping')
// GITHUB
const core = require('@actions/core')

try {
  // Get input defined in action metadata file
  const pingURL = core.getInput('PING_URL').trim()
    ? core.getInput('PING_URL').trim()
    : '127.0.0.1'
  const fileOVPN = core.getInput('FILE_OVPN').trim()
    ? core.getInput('FILE_OVPN').trim()
    : './.github/vpn/config.ovpn'
  const secret = core.getInput('SECRET').trim()
    ? core.getInput('SECRET').trim()
    : process.env.SECRET_USERNAME_PASSWORD.trim()
  const tlsKey = core.getInput('TLS_KEY').trim()
    ? core.getInput('TLS_KEY').trim()
    : process.env.TLS_KEY.trim()

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
  const OVPNFileFolder = finalPath.split('/').slice(0, -1).join('/')

  const createFile = (filename, data) => {
    const outputFile = `${OVPNFileFolder}/${filename}`
    if (exec(`echo ${data} | base64 -d >> ${outputFile}`).code !== 0) {
      core.setFailed(`Can't create file ${outputFile}`)
      process.exit(1)
    } else {
      if (exec(`sudo chmod 600 ${outputFile}`).code !== 0) {
        core.setFailed(`Can't set permission file ${outputFile}`)
        process.exit(1)
      }
    }
  }

  if (secret !== '') {
    createFile('secret.txt', secret)
  }
  if (tlsKey !== '') {
    createFile('tls.key', tlsKey)
  }

  createFile('ca.crt', process.env.CA_CRT.trim())
  createFile('user.crt', process.env.USER_CRT.trim())
  createFile('user.key', process.env.USER_KEY.trim())

  if (exec(`sudo openvpn --config ${finalPath} --daemon`).code !== 0) {
    core.setFailed(`Can't setup config ${finalPath}`)
    process.exit(1)
  }

  ping.promise
    .probe(pingURL, {
      timeout: 15,
      min_reply: 15,
    })
    .then(function (res) {
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
