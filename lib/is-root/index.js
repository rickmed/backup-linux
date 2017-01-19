exports.isRoot = () => {
  if (!process.getuid) return new Error('You are not in a POSIX system')
  else return process.getuid() === 0
}