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

module.exports = {opts}