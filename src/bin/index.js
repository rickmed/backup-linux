#! /usr/bin/env node

const yargs = require('yargs')

const {argv} = yargs(process.argv)
.options({
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
  'no-file': {
    type: 'boolean',
    default: true,
    describe: 'prints the current file being sent in the line below'
  },
  'order': {
    type: 'string',
    default: false,
    describe: 'pass a string with the order of the options you would like to be printed. Eg:\norder="b p e" (will print in order the progress bar, percentage and eta with one space in between. If this option is not set, the order of the rendering options will be the default: bar percentage rate eta data-sent)'
  }
})
.help()

console.log(argv)