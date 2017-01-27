const {execFile} = require('child_process')

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

// cb(err, data) -> child_process
/* data = {
  model: str,
  name: str,
  partitions: [{
    label: str,
    mountpoint: null,
    name: str,
    size: str
  }],
  size: str,
  vendor: str
  }
*/
const externalDrivesImp = execFile =>
  cb =>
    execFile(
      `lsblk`,
      [
        '--output=NAME,SIZE,VENDOR,MODEL,HOTPLUG,LABEL,MOUNTPOINT',
        '--json'
      ],
      {maxBuffer: 200*1024*1024},
      execFileCB(cb)
    )


const externalDrives = externalDrivesImp(execFile)

module.exports = {execFileCB, externalDrives, externalDrivesImp}