const {execFileSync} = require('child_process')
const {excludeDirs} = require('./utils')

const excludeDirsDef = ["/dev/*", "/proc/*", "/sys/*", "/tmp/*",
  "/run/*", "/mnt/*", "/media/*", "/var/run/*", "/var/lock/*",
  "/var/cache/apt/archives/*", "/lost+found", "/home/*/.gvfs",
  "/home/*/.cache", "/home/*/.local/share/Trash","/home/*/.thumbnails/*"]


// Return dir size in bytes
// str -> str
const dirSizeImp = execFileSync =>
  (path, excludePatterns = excludeDirsDef) =>
    parseInt(
      execFileSync('du',
        [...excludeDirs(excludePatterns), path, '-s', '--apparent-size'],
        {encoding: 'utf8'}
      )
        .split(/\s+/)
    )*1000

const dirSize = dirSizeImp(execFileSync)

module.exports = {dirSize, dirSizeImp}
