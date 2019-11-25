const path = require('path')
const shell = require('shelljs')
const ping = require('ping')
// GITHUB
const core = require('@actions/core')

try {
  // Get input defined in action metadata file
  const secret = core.getInput('SECRET_ACCESS')
  const pingURL = core.getInput('PING_URL')
  const tlsKey = core.getInput('TLS_KEY')
  const fileOVPN = core.getInput('FILE_OVPN')

  const finalPath = path.resolve(process.cwd(), fileOVPN)

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

  // const createFile = (filename, data) => {
  //   if (shell.exec('echo ' + data + ' | base64 -d > ' + filename).code !== 0) {
  //     core.setFailed(`Can't create file ${filename}`)
  //     shell.exit(1)
  //   }
  // }

  const addPermission = filename => {
    if (shell.chmod(600, filename).code !== 0) {
      core.setFailed(`Can't add permission file ${filename}`)
      shell.exit(1)
    }
  }

  if (shell.exec('echo ' + secret + ' | base64 -d > secret.txt').code !== 0) {
    core.setFailed(`Can't create file secret.txt`)
    shell.exit(1)
  }
  if (
    shell.exec('echo ' + process.env.CA_CRT + ' | base64 -d > ca.crt').code !==
    0
  ) {
    core.setFailed(`Can't create file ca.crt`)
    shell.exit(1)
  }
  if (
    shell.exec('echo ' + process.env.USER_CRT + ' | base64 -d > user.crt')
      .code !== 0
  ) {
    core.setFailed(`Can't create file user.crt`)
    shell.exit(1)
  }
  if (
    shell.exec('echo ' + process.env.USER_KEY + ' | base64 -d > user.key')
      .code !== 0
  ) {
    core.setFailed(`Can't create file user.key`)
    shell.exit(1)
  }
  if (shell.exec('echo ' + tlsKey + ' | base64 -d > tls.key').code !== 0) {
    core.setFailed(`Can't create file tls.key`)
    shell.exit(1)
  }

  addPermission('secret.txt')
  addPermission('ca.crt')
  addPermission('user.crt')
  addPermission('user.key')
  addPermission('tls.key')

  if (shell.exec(`sudo openvpn --config ${finalPath} --daemon`).code !== 0) {
    core.setFailed(`Can't setup config ovpn`)
    shell.exit(1)
  }

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
