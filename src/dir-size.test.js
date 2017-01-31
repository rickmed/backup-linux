const {dirSizeImp} = require('./dir-size')

const path = `/some/path`

it('returns a dir size in bytes', () => {
  const _execFileSync = jest.fn(() => `323213    /some/path`)
  const act = dirSizeImp(_execFileSync)(path)
  const exp = 323213000
  expect(act).toBe(exp)
})

it('calls execSync with the correct args', () => {
  const _execFileSync = jest.fn(() => `test str`)
  dirSizeImp(_execFileSync)(path)
  expect(_execFileSync.mock.calls[0]).toMatchSnapshot()
})



