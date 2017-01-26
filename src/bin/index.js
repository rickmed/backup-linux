#! /usr/bin/env node

const yargs = require('yargs')

const opts = {
  'e': {
    alias: 'eta',
    type: 'boolean',
    default: false,
    describe: 'ads the ETA from the progress line'
  },
  'd': {
    alias: 'data',
    type: 'boolean',
    default: false,
    describe: 'adds current data sent to the progress line'
  },
  'b': {
    alias: 'bar',
    type: 'boolean',
    default: false,
    describe: 'adds a progress bar from the progress line'
  },
  'p': {
    alias: 'percentage',
    type: 'boolean',
    default: false,
    describe: 'adds percentage to the progress line'
  },
  'r': {
    alias: 'rate',
    type: 'boolean',
    default: false,
    describe: 'adds transmission rate to the progress line'
  },
  't': {
    alias: 'elapsed',
    type: 'boolean',
    default: false,
    describe: 'adds total time passed to the progress line'
  },
  'no-file': {
    type: 'boolean',
    default: true,
    describe: 'prevents printing in the line below the current file being sent'
  },
  'o': {
    alias: 'order',
    type: 'string',
    describe: 'pass a string with the order of the options you would like to be printed. Eg:\norder "b p eta" (will print in order the progress bar, percentage and eta). If this option is not set, the order of the rendering options will be the default: data-sent bar percentage rate eta elapsed)'
  }
}

const {argv} = yargs(process.argv)
.options(opts)
.help()

// -> str -> str
const optOfAlias = alias => {
  const optKeys = Object.keys(opts)
  const findAlias = i =>
    alias === opts[optKeys[i]].alias ? optKeys[i] : findAlias(++i)
  return findAlias(0)
}

// obj -> [str]
const argvToFormatStr = argv => {
  if (argv.order) {
    return argv.order
      .trim()
      .replace('--', '')
      .split(/\s+/)
      .map(x => x.length > 1 ? optOfAlias(x) : x)

  }
  else {
    return Object.keys(argv)
      .filter(x => x.length === 1)  // out aliases
      .filter(x => x !== 'no-file')
      .filter(x => argv[x])  // in the ones with truthy values
      .filter(x => x !== '_')  // out yargs' "_"
  }
}

module.exports = {optOfAlias, argvToFormatStr}
// const {progress} = require('../progress')

// progress(argv, '73,686,941  20.40MB/s  0:00:03', '321321')



// 102,3MB [🎄🎄🎄🎄▶    ] 50% 34.4MB/s 1h20m34s 00:00:00