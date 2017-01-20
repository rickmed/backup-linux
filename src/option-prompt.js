const readline = require('readline')

const handler = (rl, opts, cb) => ans => {
  // js automatically coerse if it's a valid number, if not it's false
  if ( ans <= opts.length ) {
    cb(null, ans - 1 )
  }
  else cb(new Error("User did not chose a valid answer"))
  rl.close()
}

// displays all options + question to user and returns the index of chosen str
// [str] -> int
const optionPromptImp = (readline, process) => (opts, q, cb) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  const qPlusOpts = opts
    .reduce( (prev, cur, i) => prev.concat(`\n${i + 1}) ${cur}`), q)
    .concat('\n> ')
  rl.question(qPlusOpts, handler(rl, opts, cb))
}

const optionPrompt = optionPromptImp(readline, process)

module.exports = {handler, optionPrompt, optionPromptImp}




