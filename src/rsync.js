const {spawn} = require('child_process')
const {createInterface} = require('readline')

const excludeDirsDef = ["/dev/*", "/proc/*", "/sys/*", "/tmp/*",
  "/run/*", "/mnt/*", "/media/*", "/var/run/*", "/var/lock/*",
  "/var/cache/apt/archives/*", "/lost+found", "/home/*/.gvfs",
  "/home/*/.cache", "/home/*/.local/share/Trash","/home/*/.thumbnails/*"]

const excludeDirs = (patterns) =>
  patterns.map( x => `--exclude=${x}`)

// str -> [str] -> cb(err) -> child_process
const __rsync = (spawn, createInterface) =>
  (backupDir, destDir, excludePatterns = excludeDirsDef, cb) => {
    const rsync = spawn('rsync',
      [
        ...excludeDirs(excludePatterns),
        `--info=progress2`, `-v`, `--delete`, `-aAXHt`,
        `${backupDir}`, `${destDir}`
    ])
    rsync.on('error', x => cb(x) )
    rsync.stderr.on('data', x => cb(x) )
    const rl = createInterface({input: rsync.stdout})
    rl.on('line', x => cb(null, x) )
    return rsync
}

const rsync = __rsync(spawn, createInterface)

module.exports = {rsync, __rsync}
