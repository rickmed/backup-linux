const {spawn} = require('child_process')

const excludeDirsDef = ["/dev/*", "/proc/*", "/sys/*", "/tmp/*",
  "/run/*", "/mnt/*", "/media/*", "/var/run/*", "/var/lock/*",
  "/var/cache/apt/archives/*", "/lost+found", "/home/*/.gvfs",
  "/home/*/.cache", "/home/*/.local/share/Trash","/home/*/.thumbnails/*"]

const excludeDirs = (patterns) =>
  patterns.map(x => `--exclude=${x}`)

// (str, str, [str]) -> child_process
const __rsync = spawn =>
  (backupDir, destDir, excludePatterns = excludeDirsDef) =>
    spawn('rsync', [
      ...excludeDirs(excludePatterns),
      `--info=progress2`, `-v`, `--delete`, `-aAXHt`,
      `${backupDir}`, `${destDir}`
    ])

const rsync = __rsync(spawn)

module.exports = {rsync, __rsync}
