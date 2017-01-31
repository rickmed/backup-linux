const {__rsync} = require('./rsync')

const PATH = '/some/path'
const PATTERNS = ["/proc/*", "/sys/*"]

it('calls spawn with the correct params', () => {
  const _spawn = jest.fn()
  __rsync(_spawn)(PATH, PATH, PATTERNS)
  expect(_spawn.mock.calls).toMatchSnapshot()
});

it('calls spawn with the correct params of no patterns are passed', () => {
  const _spawn = jest.fn()
  __rsync(_spawn)(PATH, PATH, undefined)
  expect(_spawn.mock.calls).toMatchSnapshot()
});

it('should return the child_process', () => {
  const _spawn = jest.fn( () => 'test')
  const res = __rsync(_spawn)(PATH, PATH, PATTERNS)
  expect(res).toBe('test')
});
