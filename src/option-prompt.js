const readline = require('readline')

// construct string of question + options
// [str] -> str -> str
const optsStr = (opts, q) =>
  opts.reduce( (prev, curr, i) => prev.concat(`\n${i + 1}) ${curr}`), q)

// const handler = cb =>

// displays all options to user and returns the index of chosen str
// [str] -> int
const optionPromptImp = (readline, process) => (opts, question, cb) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const q = optsStr(opts, question).concat('\n> ')
  rl.question(q, ans => {
    // js automatically coerse if it's a valid number, if not it's false
    if ( ans <= opts.length ) {
      cb( ans - 1 )
    }
    else cb(new Error("User did not chose a valid answer"))
  })
}

const optionPrompt = optionPromptImp(readline, process)

module.exports = {optsStr, optionPrompt, optionPromptImp}




