#! /usr/bin/env node

const yargs = require('yargs')

const opts = {
  'a': {
    alias: 'eta',
    type: 'boolean',
    default: false,
    describe: 'ads the ETA from the progress line'
  },
  't': {
    alias: 'total',
    type: 'boolean',
    default: false,
    describe: 'adds the current total data sent to the progress line'
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
  'e': {
    alias: 'elapsed',
    type: 'boolean',
    default: false,
    describe: 'adds total time passed to the progress line'
  },
  'file': {
    type: 'boolean',
    default: true,
    describe: '--no-file to prevent printing in the line below the current file being sent'
  },
  'f': {
    alias: 'format',
    type: 'string',
    describe: 'pass a string with the format of the options you would like to be printed. Eg:\nformat ":b :p :eta" (will print in order the progress bar, percentage and eta with a space in between). If this option is not set, the order of the rendering options will be the default: data bar percentage rate eta elapsed)'
  }
}

const yargv = yargs(process.argv)
.options(opts)
.strict()
.help()

if (process.env.NODE_ENV === 'test') yargv

// -> str -> str | Error
const optAlias = opts => opt => {
  opt = opt.replace(':', '')
  const optKeys = Object.keys(opts)
  if (!opts[opt]) return new Error('ENOOPT')
  else if (!opts[opt]['alias']) return new Error('ENOALIAS')
  else return ':' + opts[opt]['alias']
}

// obj -> [str]
const argvToFormatStr = opts => argv => {
  if (argv.format) {
    return argv.format
      // /g flag calls optAlias with each match
      .replace(/:[a-z]{1}\b/g, optAlias(opts))
  }
  else {
    const optsStr = Object.keys(argv)
      .filter(x => x.length === 1)  // in only options aliases
      .filter(x => x !== 'no-file')
      .filter(x => argv[x])  // in the ones with truthy values
      .filter(x => x !== '_')  // out yargs' "_"
      .join(' ')

    const defaultOrder = 't b p r a e'
    return defaultOrder.split(' ')
      .map(x => optsStr.match(x) ? ':' + opts[x]['alias'] : null)
      .filter(x => x)
      .join(' ')
  }
}

module.exports = {opts, optAlias, argvToFormatStr}
// const {progress} = require('../progress')

// progress(argv, '73,686,941  20.40MB/s  0:00:03', '321321')



// 102,3MB [🎄🎄🎄🎄▶    ] 50% 34.4MB/s 1h20m34s 00:00:00