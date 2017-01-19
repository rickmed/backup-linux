const {execSync} = require('child_process')

// Return dir size in bytes
// str -> str
const dirSizeImp = execSync => path =>
  parseInt(
    execSync(`du ${path} -s --apparent-size`, {encoding: 'utf8'})
      .split(/\s+/)
  )*1000

const dirSize = dirSizeImp(execSync)

module.exports = {dirSize, dirSizeImp}
