const path = require('path')
const shell = require('shelljs')
const ping = require('ping')
// GITHUB
const core = require('@actions/core')

try {
  // Get input defined in action metadata file
  const username = core.getInput('USERNAME')
  const password = core.getInput('PASSWORD')
  const pingURL = core.getInput('PING_URL')
  const caCRT = core.getInput('CA_CRT')
  const userCRT = core.getInput('USER_CRT')
  const userKEY = core.getInput('USER_KEY')
  const tlsKey = core.getInput('TLS_KEY')
  const fileOVPN = core.getInput('FILE_OVPN')

  const finalPath = path.resolve(process.cwd(), fileOVPN)

  const createFile = (filename, data) => {
    if (shell.exec('echo ' + data + ' | base64 -d > ' + filename).code !== 0) {
      core.setFailed(`Can't create file`)
      shell.exit(1)
    }
  }

  const addPermission = filename => {
    if (shell.chmod(600, filename).code !== 0) {
      core.setFailed(`Can't add permission`)
      shell.exit(1)
    }
  }

  if (shell.exec('echo ' + username + ' > user.txt').code !== 0) {
    core.setFailed(`Can't create file`)
    shell.exit(1)
  }
  if (shell.exec('echo ' + password + ' > user.txt').code !== 0) {
    core.setFailed(`Can't create file`)
    shell.exit(1)
  }

  createFile('ca.crt', caCRT)
  createFile('user.crt', userCRT)
  createFile('user.key', userKEY)
  createFile('tls.key', tlsKey)

  addPermission('user.txt')
  addPermission('ca.crt')
  addPermission('user.crt')
  addPermission('user.key')
  addPermission('tls.key')

  if (shell.exec(`sudo openvpn --config ${finalPath} --daemon`).code !== 0) {
    shell.echo(`Error: can't setup config ovpn`)
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
