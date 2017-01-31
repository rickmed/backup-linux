const {bytesToHuman, convertBytes} = require('./utils')

// TODO: change math.power to ** using babel


// int -> str
const secondsToHuman = s => {
  const H = Math.floor(s / 3600)
  const M = Math.floor(s % 3600 / 60)
  const S =  Math.floor(s % 3600 % 60)

  const strH = H >= 1 ? `${H}h` : ``
  const strM = M >= 1 ? `${M}m` : ``
  const strS = `${S}s`

  return strH + strM + strS
}

// str -> [float, str]
const splitSizeFromUnits = str => {
  const splitIndex = str.search(/[a-z]/i)
  return [parseFloat(str.slice(0, splitIndex)), str.slice(splitIndex)]
}

// str -> int -> str
const eta = (rate, deltaBytes) => {
  const [rateSize, rateUnits] = splitSizeFromUnits(rate)
  const rateInBytes = convertBytes(rateUnits, rateSize)
  if (rateInBytes === 0) return 'Stalled'
  else {
    const deltaSec = Math.floor(deltaBytes / rateInBytes)
    return secondsToHuman(deltaSec)
  }
}

// int -> int -> int -> str
const bar = (completedRatio, width) => {
  width = Math.max(0, width)
  const renderCompleted = Math.floor(completedRatio * width)
  return '█'.repeat(renderCompleted) + '░'.repeat(width - renderCompleted)
}


// float -> str
const percentage = ratio =>
  (ratio * 100).toFixed(1) + '%'


// str -> [bytesSent: int, rate: str, elapsed: str]
parseRsyncProgress = str => {
  let bytesSent, rate, elapsed
  const parseBytes = str => parseInt(str.replace(/,/g, ''))
  if (str[0] === ' ') [ , bytesSent, , rate, elapsed] = str.split(/\s+/)
  else [bytesSent, , rate, elapsed] = str.split(/\s+/)
  return [parseBytes(bytesSent), rate, elapsed]
}


/**
* @function progressInfo Curried
* @param  {string[]} format Tokens (EG: ":bar :eta")
* @param  {number} dirSize
* @param  {string} rsyncProgress
* @param  {number} width Max bytes to use
* @return {string} format populated with data
*/
const progressInfo = format => dirSize => rsyncProgress => width => {
  let [bytesSent, rate, elapsed] = parseRsyncProgress(rsyncProgress)
  const completedRatio = bytesSent / parseInt(dirSize)
  const deltaBytes = dirSize - bytesSent

  const populatedMinusBar = format
    .replace(':eta', eta(rate, deltaBytes))
    .replace(':total', bytesToHuman(bytesSent))
    .replace(':percentage', percentage(completedRatio))
    .replace(':rate', rate)
    .replace(':elapsed', elapsed)

  if ( !populatedMinusBar.includes(':bar') ) return populatedMinusBar
  else {
    const availWidth = width - populatedMinusBar.length + ':bar'.length - 2
    return populatedMinusBar.replace(':bar', bar(completedRatio, availWidth))
  }
}

module.exports = {convertBytes, secondsToHuman, eta, splitSizeFromUnits, bar, parseRsyncProgress, progressInfo}

