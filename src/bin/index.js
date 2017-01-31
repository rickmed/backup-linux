#! /usr/bin/env node

const yargs = require('yargs')
const {opts} = require('./yargs_opts')
const backup = require('../')
const {argvToFormatStr, formatDevInfo, devName} = require('../utils')

const yargv = yargs(process.argv)
  .options(opts)
  .strict()
  .help()
  .argv

const progressFormat = argvToFormatStr(opts)(yargv)

backup(progressFormat, (e, res) => {
  if (e) {
    console.log(e)
    process.exitCode = 1
  }
  else {
    const backup_msg = `Backup Completed in ${res.done}. Size: ${res.size}.`
    if (res.umount) {
      console.log(backup_msg)
      console.log('But there was a problem unmounting the device', report.umount.e)
    }
    else console.log(backup_msg)
  }
})
