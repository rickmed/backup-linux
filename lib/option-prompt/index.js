const readline = require('readline')

// construct string of question + options
// [str] -> str -> str
const optsStr = (opts, q) =>
  opts.reduce( (prev, curr, i) => prev.concat(`\n${i + 1}) ${curr}`), q)

const handler = ans => {

}

// displays all options to user and returns the chosen str
// [str] -> str
const optionPromptImp = (readline, process) => (opts, question, cb) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const q = optsStr(opts, question).concat('\n> ')
  rl.question(q, handler)

}

const optionPrompt = optionPromptImp(readline, process)

module.exports = {optsStr, optionPrompt, optionPromptImp}




