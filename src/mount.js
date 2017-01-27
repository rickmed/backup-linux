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

/**
* @function umount
* @param  {String} devName
* @param  {Function} cb  (err, data) data is the mountedPath
*/
const mount = __mount(execFile, mkdir)



const __umount = (execFile, rmdir) =>
  partName => mountedPath => cb => {
    execFile( `umount`, [`/dev/${partName}`],
      (err, stdout, stderr) => {
        const cbErr = err || stderr
        if (cbErr) cb(cbErr)
        else {
        // auto double check bc if dev still mounted, rmdir will fail
          rmdir(mountedPath, err => cb(err))
        }
      }
    )
  }

/**
* @function umount
* @param  {string} partName {Partition name. Eg: "sdb1"}
* @param  {string} mountedPath {}
* @param  {function} cb    {only err param}
* @return {unit} {Unit}
*/
const umount = __umount(execFile, rmdir)

module.exports = {__execCB, mount, __mount, umount, __umount}