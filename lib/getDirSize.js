const {execSync} = require('child_process')

// Return dir size in bytes
// str -> str
exports.getDirSize = (path, execSync = execSync) =>
  parseInt(
    execSync(`du ${path} -s --apparent-size`, {encoding: 'utf8'})
      .split(/\s+/)
  )*1000
