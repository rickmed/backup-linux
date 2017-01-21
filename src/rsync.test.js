const {__rsync} = require('./rsync')

describe('rsync', () => {

  const PATH = '/some/path'
  const PATTERNS = ["/proc/*", "/sys/*"]
  const SOME = 'some'
  let _spawn, _createInterface, _cb

// listeners are not fun to test:
// I can use global since the listeners below are only used once in the function
  const callCB = (ev, cb) => cb(SOME)
  beforeEach(() => {
    _createInterface = jest.fn( () => ({
      on: jest.fn(callCB)
    }))
    _spawn = jest.fn(() => ({
      on: jest.fn(callCB),
      stderr: {
        on: jest.fn(callCB)
      }
    }))
    _cb = jest.fn()
  })

  it('calls spawn with the correct params', () => {
    __rsync(_spawn, _createInterface)(PATH, PATH, PATTERNS, _cb)
    const spawnArgs = ['--exclude=/proc/*',
      '--exclude=/sys/*',
      '--info=progress2',
      '-v',
      '--delete',
      '-aAXHt',
      '/some/path',
      '/some/path'
    ]
    expect(_spawn).toBeCalledWith('rsync',spawnArgs)
  });

  it('should return a child_process', () => {
    const res = __rsync(_spawn, _createInterface)(PATH, PATH, PATTERNS, _cb)
    expect(res.on).toBeDefined()
  });

// this does not test that the right event string is added
// also, each one *should* have its own test
  it('all listeners are registered and would be called correctly', () => {
    __rsync(_spawn, _createInterface)(PATH, PATH, PATTERNS, _cb)
    expect(_cb).toHaveBeenCalledTimes(3)
    expect(_cb).toBeCalledWith(SOME)
    expect(_cb).toBeCalledWith(null, SOME)
  })

// Alternative below test both event string and cb working
  it('spawn on error event works ok', (done) => {
    _spawn = jest.fn(() => ({
      on: jest.fn( (ev, cb) => {
        expect(ev).toBe('error')
        cb(SOME)
        expect(_cb).toHaveBeenLastCalledWith(SOME)
        done()
      }),
      stderr: {
        on: jest.fn()
      }
    }))
    __rsync(_spawn, _createInterface)(PATH, PATH, PATTERNS, _cb)
  });

  it('spawn stderr on error event works ok', (done) => {
    _spawn = jest.fn(() => ({
      on: jest.fn(),
      stderr: {
        on: jest.fn( (ev, cb) => {
          expect(ev).toBe('data')
          cb(SOME)
          expect(_cb).toHaveBeenLastCalledWith(SOME)
          done()
        })
      }
    }))
    __rsync(_spawn, _createInterface)(PATH, PATH, PATTERNS, _cb)
  });

  it('readline on line event works ok', (done) => {
    _createInterface = jest.fn( () => ({
      on: jest.fn( (ev, cb) => {
        expect(ev).toBe('line')
        cb(SOME)
        expect(_cb).toHaveBeenLastCalledWith(null, SOME)
        done()
      })
    }))
    __rsync(_spawn, _createInterface)(PATH, PATH, PATTERNS, _cb)
  });

});