const {execFile} = require('child_process')
const {isRoot} = require('../is-root')

// the err, stdout, stderr and cb logic could be extracted is used elsewhere
const execFileCB = cb => (err, stdout, stderr) => {
  const cbErr = err || stderr
  if (cbErr) cb(cbErr)
  else {
    const devInfo = JSON.parse(stdout)['blockdevices']
      .filter(x => x.hotplug === '1')
      .map(x => ({
        vendor: x.vendor,
        model: x.model,
        size: x.size,
        sysName: x.name
      }))
    cb(null, devInfo)
  }
}

// cb(err, data) -> child_process
// data: [{vendor: str, model:str, size:str, sysName: str}]
const externalDrivesImp = (execFile, isRoot) => cb => {
  if (!isRoot()) cb(new Error('You must run as root'))
  else return execFile(
    `lsblk`,
    ['--nodeps', '--output=NAME,SIZE,VENDOR,MODEL,HOTPLUG', '-J'],
    {maxBuffer: 200*1024*1024},
    execFileCB(cb)
  )
}

const externalDrives = externalDrivesImp(execFile, isRoot)

module.exports = {execFileCB, externalDrives, externalDrivesImp}