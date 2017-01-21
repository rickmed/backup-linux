// this function should have DI with process on param but is not to
// learn how to mock global objects in test
exports.isRoot = () => {
  if (!process.getuid) return new Error('You are not in a POSIX system')
  else return process.getuid() === 0
}