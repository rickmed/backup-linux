const {__rsync} = require('./rsync')
const EventEmitter = require('events')

class Emitter extends EventEmitter {}
const PATH = '/some/path'
const PATTERNS = ["/proc/*", "/sys/*"]

let _spawn, _cb, _child

beforeEach(() => {
  _spawn = jest.fn( () => {
    _child = new Emitter()
    _child.stderr = new Emitter()
    return _child
  })
  _cb = jest.fn()
})

it('calls spawn with the correct params', () => {
  __rsync(_spawn)(PATH, PATH, PATTERNS, _cb)
  expect(_spawn.mock.calls).toMatchSnapshot()
});

it('calls spawn with the correct params of no patterns are passed', () => {
  __rsync(_spawn)(PATH, PATH, undefined, _cb)
  expect(_spawn.mock.calls).toMatchSnapshot()
});

it('should return a child_process', () => {
  const res = __rsync(_spawn)(PATH, PATH, PATTERNS, _cb)
  expect(res.on).toBeDefined()
});

it('spawn on error event works ok', () => {
  __rsync(_spawn)(PATH, PATH, PATTERNS, _cb)
  _child.emit('error', 'some err')
  expect(_cb).toBeCalledWith('some err')
});

it('spawn stderr on error event works ok', () => {
  __rsync(_spawn)(PATH, PATH, PATTERNS, _cb)
  _child.stderr.emit('data', 'some data')
  expect(_cb).toBeCalledWith('some data')
});
