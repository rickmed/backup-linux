const rl = require('readline')

const __fitInTTY = stdout =>
  ln => {
    if ( typeof ln === 'string') {
      if (ln.length < stdout.columns) return ln
      else return `${ln.slice(0, stdout.columns - 4)}...`
    }
    else return ln
  }

const fitInTTY = __fitInTTY(process.stdout)

// pass an array with the strings to print in the same line
/* const log = logger(2) // reserve 2 lines
log([null, 'some str']) */ // first line will not be changed
// messages will be truncated to terminal width to keep consistency
// int -> ([str] -> ())
const __logger = (rl, stdout, fitInTTY) =>
// since fitInTTY is unpure, is a dependency injected in __logger to mock
  lines => {

    const cursorDown = dy => rl.moveCursor(stdout, 0, dy)

    cursorDown(lines - 1)

    const log = xs => {
      // move up
      cursorDown((-xs.length) + 1)
      xs
      .map(fitInTTY)
      .forEach( (x, i, arr) => {
        const isLast = (i === arr.length - 1) ? true : false
        if ( x === null ) {
          if (!isLast) cursorDown(1)
        }
        else {
          rl.cursorTo(stdout, 0)
          stdout.write(x)
          rl.clearLine(stdout, 1)
          if (!isLast) cursorDown(1)
        }
      })
    }

    return log
  }

const logger = __logger(rl, process.stdout, fitInTTY)

module.exports = {logger, __logger, __fitInTTY}
