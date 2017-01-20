const {execFile} = require('child_process')
const {mkdir} = require('fs')


// the err, stdout, stderr and cb logic could be extracted is used elsewhere
const execFileCB = cb => (err, stdout, stderr) => {
  const cbErr = err || stderr
  if (cbErr) cb(cbErr)
  else {
    const devInfo = JSON.parse(stdout)['blockdevices']
      .filter(x => x.hotplug === '1')
      .map(x => {
        const partitions = x.children
          .map(x => {
            const {name, size, label, mountpoint} = x
            return {name, size, label, mountpoint}
          })
        const {vendor, model, size, name} = x
        return { vendor, model, size, name, partitions }
      })
    cb(null, devInfo)
  }
}

// str -> (err, data) -> ()
// data is the mounted path
const mountDeviceImp = (execFile, mkdir) => (devName, cb) => {
  const reTryIfDirExist = num => {
    const mountPath = `/tmp/${devName}-${num}`
    mkdir(mountPath, err => {
      if (num === 5) cb(err)
      else if (err.code === 'EEXIST') {
        reTryIfDirExist(num + 1)
      }
      else if (err) cb(err)
      else execFile(`mount`, [`/dev/${devName}`, mountPath], execFileCB(cb))

    })
  }
  reTryIfDirExist(1)
}


const mountDevice = mountDeviceImp(execFile, mkdir)

module.exports = {execFileCB, mountDevice, mountDeviceImp}