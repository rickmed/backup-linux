// TODO: change math.power to ** using babel

// str -> int -> int
const convertBytes = (units, magnitude) => {
  // check if conversion is bytes -> k|M|G or inverse
  const convert = magnitude > 1000 ?
    (bytes, exp) => bytes / Math.pow(10, exp) :
    (scalar, exp) => scalar * Math.pow(10, exp)

  const result =
    /k/i.test(units) ? convert(magnitude, 3) :
    /m/i.test(units) ? convert(magnitude, 6) :
    /g/i.test(units) ? convert(magnitude, 9) :
    /t/i.test(units) ? convert(magnitude, 12) :
    magnitude

  return result
}

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
  const deltaSec = Math.floor(deltaBytes / rateInBytes)
  return secondsToHuman(deltaSec)
}

// int -> int -> int -> str
const bar = (completedRatio, width) => {
  const renderCompleted = Math.floor(completedRatio * width)
  return '█'.repeat(renderCompleted) + '░'.repeat(width - renderCompleted)
}

// int -> str
const bytesToHuman = b =>
  b >= Math.pow(10, 12) ? `${convertBytes('t', b).toFixed(1)}TB` :
  b >= Math.pow(10, 9) ? `${convertBytes('g', b).toFixed(1)}GB` :
  b >= Math.pow(10, 6) ? `${convertBytes('m', b).toFixed(1)}MB` :
  `${convertBytes('k', b).toFixed(1)}kB`

// float -> str
const percentage = ratio =>
  (ratio * 100).toFixed(1) + '%'

/**
* @function progressInfo Curried
* @param  {string[]} opts Tokens (EG: ":bar :eta")
* @param  {number} dirSize
* @param  {string} rsyncProgress
* @param  {number} width Max bytes to use
* @return {string} Opts populated with data
*/
const progressInfo = opts => dirSize => rsyncProgress => width => {
  let [bytesSent, , rate, elapsed] = rsyncProgress.split(/\s+/)
  const bytesSentInt = parseInt(bytesSent.replace(/,/g, ''))
  const completedRatio = bytesSentInt / dirSize
  const deltaBytes = dirSize - bytesSentInt

  const populatedMinusBar = opts
    .replace(':eta', eta(rate, deltaBytes))
    .replace(':total', bytesToHuman(bytesSentInt))
    .replace(':percentage', percentage(completedRatio))
    .replace(':rate', rate)
    .replace(':elapsed', elapsed)

  if ( !populatedMinusBar.includes(':bar') ) return populatedMinusBar
  else {
    const availWidth = width - populatedMinusBar.length + ':bar'.length
    return populatedMinusBar.replace(':bar', bar(completedRatio, availWidth))
  }
}

module.exports = {convertBytes, secondsToHuman, eta, splitSizeFromUnits, bar, bytesToHuman, progressInfo}

