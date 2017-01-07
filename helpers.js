const {execSync} = require('child_process')

function getDirSize(path) {
  return parseInt(execSync(`du ${path} -s --apparent-size`, {encoding: 'utf8'})
  .split(/\s+/)
  )*1000
}

module.exports = {getDirSize}

