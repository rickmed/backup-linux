const {spawn} = require('child_process')

const excludeDirsDef = ["/dev/*", "/proc/*", "/sys/*", "/tmp/*",
  "/run/*", "/mnt/*", "/media/*", "/var/run/*", "/var/lock/*",
  "/var/cache/apt/archives/*", "/lost+found", "/home/*/.gvfs",
  "/home/*/.cache", "/home/*/.local/share/Trash","/home/*/.thumbnails/*"]

const excludeDirs = (patterns) =>
  patterns.map( x => `--exclude=${x}`)

// str -> [str] -> cb(err) -> child_process
// child_process error and rsync stderr are sent to cb
const __rsync = spawn =>
  (backupDir, destDir, excludePatterns = excludeDirsDef, cb) => {
    const rsync = spawn('rsync',
      [
        ...excludeDirs(excludePatterns),
        `--info=progress2`, `-v`, `--delete`, `-aAXHt`,
        `${backupDir}`, `${destDir}`
    ])
    rsync.on('error', x => cb(x) )
    rsync.stderr.on('data', x => cb(x) )
    return rsync
}

const rsync = __rsync(spawn)

module.exports = {rsync, __rsync}
