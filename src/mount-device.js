const {execFile} = require('child_process')
const {mkdir, rmdir} = require('fs')


// the err, stdout, stderr and cb logic could be extracted is used elsewhere
const execHandlerImp = rmdir => (mountPath, cb) => (err, stdout, stderr) => {
  if (err) {
    rmdir(mountPath, err => {
      err.mountDevice = 'Remove mountPath failed on cleanup'
      cb(err)
    })
  }
  else cb(null, mountPath)
}

const execHandler = execHandlerImp(rmdir)


// str -> (err, data) -> ()
// data is the mounted path
const mountDeviceImp = (execFile, mkdir) => (devName, cb) => {
  const reTryIfDirExist = num => {
    const mountPath = `/tmp/${devName}-${num}`
    mkdir(mountPath, err => {
      if (num === 5) {
        err.mountDevice = `Failed after trying to create mounting dirs with ${num} different names`
        cb(err)
      }
      else if (err && err.code === 'EEXIST') {
        reTryIfDirExist(num + 1)
      }
      else if (err) cb(err)
      else execFile(
        `mount`,
        [`/dev/${devName}`, mountPath],
        execHandler(mountPath, cb)
      )
    })
  }
  reTryIfDirExist(1)
}

const mountDevice = mountDeviceImp(execFile, mkdir)

module.exports = {execHandlerImp, mountDevice, mountDeviceImp}