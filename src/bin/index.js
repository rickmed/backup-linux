#! /usr/bin/env node

const yargs = require('yargs')
const {opts} = require('./yargs_opts')
const {argvToFormatStr} = require('./utils')
const {externalDrives} = require('../external-drives')

const yargv = yargs(process.argv)
  .options(opts)
  .strict()
  .help()

externalDrives( (err, data) => {
  if (err) console.log(err)
  console.log(JSON.stringify(data, null, 2))
})