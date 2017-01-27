const {execFile} = require('child_process')
const {mkdir, rmdir} = require('fs')

const __execCB = rmdir => (mountPath, cb) => (err, stdout, stderr) => {
  if (err) {
    rmdir(mountPath, err => {
      err.mount = 'Remove mountPath failed on cleanup'
      cb(err)
    })
  }
  else cb(null, mountPath)
}

const execCB = __execCB(rmdir)


// str -> (err, data) -> ()
// data is the mounted path
const __mount = (execFile, mkdir) => (devName, cb) => {
  const reTryIfDirExist = num => {
    const mountPath = `/tmp/${devName}-${num}`
    mkdir(mountPath, err => {
      if (num === 5) {
        err.mount = `Failed after trying to create mounting dirs with ${num} different names`
        cb(err)
      }
      else if (err && err.code === 'EEXIST') {
        reTryIfDirExist(num + 1)
      }
      else if (err) cb(err)
      else execFile(
        `mount`,
        [`/dev/${devName}`, mountPath],
        execCB(mountPath, cb)
      )
    })
  }
  reTryIfDirExist(1)
}

const mount = __mount(execFile, mkdir)

module.exports = {__execCB, mount, __mount}