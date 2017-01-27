// const {execFile} = require('child_process')
// const {rmdir} = require('fs')

// const __execCB = rmdir =>
//   (mountPath, cb) =>
//     (err, stdout, stderr) => {
//       const cbErr = err || stderr
//       if (cbErr) cb(cbErr)
//       else {
//         rmdir(mountPath, err => cb(err) )
//       }
//     }

// const execCB = __execCB(rmdir)


// // str -> (err, data) -> ()
// // data is the mounted path


// const __umount = (execFile, rmdir) =>
//   partName => mountPath => cb => {
//     execFile(
//       `umount`,
//       [`/dev/${partName}`],
//       execCB(mountPath, cb)
//     )
// }


// /**
// * @function umount
// * @param  {string} partName {Partition name. Eg: "sdb1"}
// * @param  {function} cb    {only err param}
// * @return {unit} {Unit}
// */
// const umount = __umount(execFile, mkdir)

// module.exports = {__execCB, umount, __umount}


const {execFile} = require('child_process')
const {rmdir} = require('fs')


const __umount = (execFile, rmdir) =>
  (partName, mountPath) => cb => {
    execFile( `umount`, [`/dev/${partName}`],
      (err, stdout, stderr) => {
        const cbErr = err || stderr
        if (cbErr) cb(cbErr)
        else {
          rmdir(mountPath, err => cb(err))
        }
      }
    )
  }


/**
* @function umount
* @param  {string} partName {Partition name. Eg: "sdb1"}
* @param  {string} mountPath {}
* @param  {function} cb    {only err param}
* @return {unit} {Unit}
*/
const umount = __umount(execFile, mkdir)

module.exports = {umount, __umount}