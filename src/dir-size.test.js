const {dirSizeImp} = require('./dir-size')

const path = `/some/path`

it('returns a dir size in bytes', () => {
  const _execSync = jest.fn(() => `323213    /some/path`)
  const act = dirSizeImp(_execSync)(path)
  const exp = 323213000
  expect(act).toBe(exp)
})

it('calls execSync with the correct args', () => {
  const _execSync = jest.fn(() => `test str`)
  dirSizeImp(_execSync)(path)
  const act = _execSync.mock.calls[0]
  const exp = [
    `du ${path} -s --apparent-size`,
    {encoding: 'utf8'}
  ]
  expect(act).toEqual(exp)
})



