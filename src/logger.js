const rl = require('readline')

const __fitInTTY = stderr =>
  ln => {
    if ( typeof ln === 'string') {
      if (ln.length < stderr.columns) return ln
      else return `${ln.slice(0, stderr.columns - 4)}...`
    }
    else return ln
  }

const fitInTTY = __fitInTTY(process.stderr)

// pass an array with the strings to print in the same line
/* const log = logger(2) // reserve 2 lines
log([null, 'some str']) */ // first line will not be changed
// messages will be truncated to terminal width to keep consistency
// int -> ([str] -> ())
const __logger = (rl, stderr, fitInTTY) =>
// since fitInTTY is unpure, is a dependency injected in __logger to mock
  lines => {
    // moves down
    rl.moveCursor(stderr, 0, lines - 1)

    const log = xs => {
      // moves up
      rl.moveCursor(stderr, 0, (-xs.length) + 1)
      xs
      .map(fitInTTY)
      .forEach( (x, i, arr) => {
        const isLast = (i === arr.length - 1) ? true : false
        if ( x === null ) {
          if (!isLast) rl.moveCursor(stderr, 0, 1)
        }
        else {
          rl.cursorTo(stderr, 0)
          stderr.write(x)
          rl.clearLine(stderr, 1)
          if (!isLast) rl.moveCursor(stderr, 0, 1)
        }
      })
    }

    return log
  }

const logger = __logger(rl, process.stderr, fitInTTY)

module.exports = {logger, __logger, __fitInTTY}
