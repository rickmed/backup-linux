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

    const defaultOrder = 't b p r a e'
    return defaultOrder.split(' ')
      .map(x => optsStr.match(x) ? ':' + opts[x]['alias'] : null)
      .filter(x => x)
      .join(' ')
  }
}

module.exports = {optAlias, argvToFormatStr}
