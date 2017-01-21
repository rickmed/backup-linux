const __fitInTTY = stdout =>
  ln =>
    ln.length < stdout.columns ? ln :
      `${ln.slice(0, stdout.columns - 4)}...`

const fitInTTY = __fitInTTY(process.stdout)

// replace the relative line in the tty
// eg: 1 replaces the current line, 2, the line below, etc.
// first call will just print the msgs
// then pass an array with the strings in order to print
// if null in array, that line will stay the same
// messages will be truncated to terminal width to keep consistency
// since fitInTTY is unpure, is a dependency injected in __logger to mock
const __logger = (stdout, fitInTTY) =>
  fstMsgs => {
    const ttyLog = stdout.write

    fstMsgs
      .map(fitInTTY)
      .forEach( x => ttyLog(`${x}\n`) )

    const editLines = msgs => {
      // move cursor up at the start and to first col
      ttyLog( "\x1B[" + msgs.length + "A\r" )
      msgs
        .map(fitInTTY)
        .forEach( x => {
          if ( x === null ) ttyLog("\x1B[1B\r")
          // delete the line and print the new one
          else ttyLog("\x1B[2K" + `${x}\n`)
        })
    }
    return editLines
}

const logger = __logger(process.stdout, fitInTTY)

module.exports = {logger, __logger, __fitInTTY}