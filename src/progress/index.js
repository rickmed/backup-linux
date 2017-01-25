// TODO: change math.power to ** using babel

// 73,686,941  20.40MB/s  0:00:03

// e=ETA, d=DATA SENT, h=human, b=progressbar, p=progress

// human: XX,XM/G/K

// [🎄🎄🎄🎄▶    ] 50%  34.4MB/s ETA: 00:00:00 102,3MB


// need to calculate:
// eta
// data sent in human
// bar
// %

/**
* @function makeStr
* @param  {array} options in order to be added
* @return {string}
*/
const makeStr = opts =>
  opts.reduce()


// str -> int -> int
// str is k|M|G|T
const bytesTo = units => bytes =>
  /k/i.test(units) ? bytes * Math.pow(1, 3) :
  /m/i.test(units) ? bytes * Math.pow(1, 6) :
  /g/i.test(units) ? bytes * Math.pow(1, 9) :
  /t/i.test(units) ? bytes * Math.pow(1, 12) :
  bytes


const eta = rate => deltaB => {
  const [mag, units] = rate.split(/MB|kB|B/)
  const magInB = units === 'MB' ? mag * Math.pow(1, 6) :
    units === 'kB' ? mag * Math.pow(1, 3) :
    mag
  const deltaSec = Math.floor(deltaB / parseInt(mag))

}



/**
* @function __progress
* @param  {object} opts          {options to include in string}
* @param  {string} rsyncProgress {stdout of rsync}
* @param  {string} dirSize       {total size to calculate %}
* @return {string} {formated string with the info based on passed opts}
*/
const __progress = stderr =>
  (opts, rsyncProgress, dirSize) => {
    const [bytesSent, , rate, time] = rsyncProgress.split(/\s+/)
    const deltaB = parseInt(dirSize) - parseInt(bytesSent.replace(/,/g, ''))






    if (opts.o) {

    }
    else {
      return Object.keys(opts)
      // filter no-file option
      .filter(x => x.length === 1)
      .filter(x => opts[x])



    }
  }

const progress = __progress(process.stderr)

module.exports = {__progress, progress}

