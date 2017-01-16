const {getDirSize} = require('./index.js')

describe('getDirSize', () => {

  const fakeExecSync = jest.fn(() => `323213    /some/path`)
  const path = `/some/path`

  it('returns a dir size in bytes', () => {
    const act = getDirSize(path, fakeExecSync)
    const exp = 323213000
    expect(act).toBe(exp)
  })

  it('calls execSync with the correct args', () => {
    const arg1 = `du ${path} -s --apparent-size`
    const arg2 = {encoding: 'utf8'}
    getDirSize(path, fakeExecSync)
    expect(fakeExecSync).toBeCalledWith(arg1, arg2)
  })

})




