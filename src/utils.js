// -> str -> str | Error
const optAlias = opts => opt => {
  const cleanOpt = opt.replace(':', '')
  const optKeys = Object.keys(opts)
  if (!opts[cleanOpt] || !opts[cleanOpt]['alias']) return opt
  else return ':' + opts[cleanOpt]['alias']
}

/**
 * @function argvToFormatStr
 * @param  {object} opts - Options passed to yargs
 * @param  {object} argv - Output of yargs
 * @return {string} With tokens to be populated. Eg ":bar :eta"
 */
const argvToFormatStr = opts => argv => {
  if (argv.format) {
    return argv.format
      // /g flag calls optAlias with each match
      .replace(/:[a-z]{1}\b/g, optAlias(opts))
  }
  else {
    const optsStr = Object.keys(argv)
      .filter(x => x.length === 1) // in only options aliases
      .filter(x => x !== 'no-file')
      .filter(x => argv[x]) // in the ones with truthy values
      .filter(x => x !== '_') // out yargs' "_"
      .join(' ')

    if (optsStr.length === 0) {
      return ':total :bar :percentage :rate :eta :elapsed'
    }

    const defaultOrder = 't b p r a e'
    return defaultOrder.split(' ')
      .map(x => optsStr.match(x) ? ':' + opts[x]['alias'] : null)
      .filter(x => x)
      .join(' ')
  }
}


/**
 * @function formatDevInfo
 * @param  {Array<Object>} devInfo
 * @return {Array<String>}
 */
const formatDevInfo = devInfo =>
  devInfo.reduce((acc, cur) => {
    const partitions = cur.partitions.map(x => {
      const lab = x.label || 'No_label'
      return `${x.name} ${lab} ${x.size} in ${cur.vendor} ${cur.model}`
    })
    return [...acc, ...partitions]
  }, [])


/**
 * @function devName
 * @param  {String} str device info
 * @return {String} device full path
 */
const devName = str =>
  str.match(/sd[a-z]{1}\d{1,}/)[0]


/**
* @function excludeDirs
* @param  {String[]} patterns {description}
* @return {String[]} {description}
*/
const excludeDirs = (patterns) =>
  patterns.map(x => `--exclude=${x}`)


/**
* @function convertBytes
* @param  {string} units
* @param  {number} magnitude
* @return {number}
*/
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


/**
* @function bytesToHuman
* @param  {number} cb
* @return {string} {description}
*/
const bytesToHuman = b =>
  b >= Math.pow(10, 12) ? `${convertBytes('t', b).toFixed(1)}TB` :
  b >= Math.pow(10, 9) ? `${convertBytes('g', b).toFixed(1)}GB` :
  b >= Math.pow(10, 6) ? `${convertBytes('m', b).toFixed(1)}MB` :
  `${convertBytes('k', b).toFixed(1)}kB`

module.exports = {
  optAlias,
  argvToFormatStr,
  formatDevInfo,
  devName,
  excludeDirs,
  convertBytes,
  bytesToHuman
}