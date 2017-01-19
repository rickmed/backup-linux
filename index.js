#! /usr/bin/env node

const {getDirSize} = require('./lib/getDirSize.js')
const {spawn} = require('child_process')
const {createWriteStream} = require('fs')
const {createInterface} = require('readline')

const src = `/usr/share`

// shell: true is convenience but less safe and slower
const rsync = spawn(`rsync -a -v --info=progress2 ${src} ~/Desktop/rsynctest`, {shell: true})
const log = createWriteStream('rsnode.log')

// parses stdout line by line to callback
const rl = createInterface({input: rsync.stdout})




function progressStdout (line) {
  if ( /xfr#|%/.test(line) ) {
  console.log(line)
  log.write(line + '\n')}
  else console.log('hello');
}

rl.on('line', progressStdout)
// rsync.stdout.setEncoding('utf8')
  .on('data', progressStdout)

rsync.on('error', err => console.log(`Could not spawn child. Error: ${err}`) )
rsync.stderr.on('data', data => console.log(`Stderr from child: ${data}`) )


