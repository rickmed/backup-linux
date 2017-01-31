const {externalDrives} = require('./external-drives')
const {optionPrompt} = require('./option-prompt')
const {mount, umount} = require('./mount')
const {formatDevInfo, devName, bytesToHuman} = require('./utils')
const {mkdir} = require('fs')
const {dirSize} = require('./dir-size')
const {rsync} = require('./rsync')
const {progressInfo, secondsToHuman} = require('./progress-info')
const readline = require('readline')
const {logger} = require('./logger')

// rl -> cb -> ()
const __processAndReport = (process, dirSize) =>
  (rl, progress, backupDir, umountDev, cb) => {
    const print = logger(2)
    const start = new Date
    rl
      .on('line', line => {
        if (line === '') return
        else if ( /xfr#|%/.test(line) ) {
          let prog = progress(line)(process.stdout.columns)
          print([prog, null])
        }
        else print([null, line])
      })
      .on('close', () => {
        print()
        console.log('\n')
        const duration = secondsToHuman(((new Date) - start) / 1000)
        console.log('Calculating backup size...')
        const destSize = bytesToHuman(dirSize(backupDir, ['']))
        const report = {done: duration, size: destSize}
        umountDev(e => {
          if (e) {
            report.umount = e
            cb(null, report)
          }
          else cb(null, report)
        })
      })
  }


const processAndReport = __processAndReport(process, dirSize)

// @TODO try if sudo is not needed, if not, add check super user
// @TODO decide to split this function
const __backup = dep  =>
  (progressFormat, cb) => {
    const sourceDir = '/usr/share/icons'
    console.log(`Calculating system size...`)
    const sourceDirSize = dirSize(sourceDir)
    console.log(`Will backup ${bytesToHuman(sourceDirSize)}`)
    console.log('Looking for external devices...')
    dep.externalDrives( (e, xs) => {
      if (e) cb(e)
      else {
        const q = `Choose the device to backup to`
        const opts = formatDevInfo(xs)
        dep.optionPrompt(opts, q, (e, ans) => {
          if (e) cb(e)
          else {
            const deviceName = devName(opts[ans])
            console.log(`Mounting device: ${deviceName}`)
            dep.mount(deviceName, (err, mountedPath) => {
              if (err) cb(err)
              else {
                const {Date} = dep
                const today = (new Date())
                  .toDateString()
                const backupDir = mountedPath + '/' + today
                dep.mkdir(backupDir, e => {
                  if (e === null || (e && e.code === 'EEXIST') ) {
                    console.log(`Backing up to ${backupDir}`)
                    console.log(`Starting backup...`)
                    const rsync_cp = dep.rsync(sourceDir, backupDir)
                    rsync_cp.on('error', e => cb(e))
                    rsync_cp.stderr
                      .setEncoding('utf8')
                      .on('data', e => cb(e))
                    const rl = readline.createInterface({input: rsync_cp.stdout})
                    const progress = progressInfo(progressFormat)(sourceDirSize)
                    const umountDev = umount(deviceName)(mountedPath)
                    processAndReport(rl, progress, backupDir, umountDev, cb)
                  }
                  else cb(e)
                })
              }
            })
          }
        })
      }
    })
  }

const dep = {externalDrives, optionPrompt, mount,
  Date, mkdir, rsync, umount }

const backup = __backup(dep)

module.exports = backup
