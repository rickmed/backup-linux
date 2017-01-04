#! /usr/bin/env node

const {spawn, execSync} = require('child_process')
const {createWriteStream} = require('fs')
const {createInterface} = require('readline')

const src = `/usr/share`

const backupSize = parseInt(execSync(`du ${src} -s --apparent-size`, {encoding: 'utf8'})
  .split(/\s+/))*1000

console.log(`backup size: ${backupSize}`);

const rsync = spawn(`rsync -a -v --info=progress2 ${src} ~/Desktop/rsynctest`, {shell: true})
const log = createWriteStream('rsnode.log')

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


