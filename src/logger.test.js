const { __fitInTTY, __logger } = require('./logger')

describe('fitInTTY', () => {

  const _stdout = {
    columns: 10
  }

  it('truncates str to 9 chars', () => {
    expect(__fitInTTY(_stdout)("I wont fit in tty")).toMatchSnapshot()
  });

  it('should return its input if it is not a string', () => {
    expect(__fitInTTY(_stdout)(null)).toMatchSnapshot()
  });

});

describe('logger', () => {

  let _rl, _stdout, _fitInTTY
  beforeEach(() => {
    _rl = {
      moveCursor: jest.fn(),
      cursorTo: jest.fn(),
      clearLine: jest.fn()
    }
    _stdout = {
      write: jest.fn()
    }
    _fitInTTY = jest.fn(x => x)
  })

  it('should call (position) moveCursor with correct params', () => {
    __logger(_rl, _stdout, _fitInTTY)(2)
    expect(_rl.moveCursor).toHaveBeenLastCalledWith(_stdout, 0, 1)
  });

  describe('log', () => {

    it('should call moveCursor 3 times with correct params', () => {
      const log = __logger(_rl, _stdout, _fitInTTY)(2)
      log([null, 'str'])
      expect(_rl.moveCursor.mock.calls).toMatchSnapshot()
    });

    it('should call cursorTo with correct params', () => {
      const log = __logger(_rl, _stdout, _fitInTTY)(2)
      log([null, 'str'])
      expect(_rl.cursorTo).toHaveBeenLastCalledWith(_stdout, 0)
    });

    it('should call stdout.write with correct params', () => {
      const log = __logger(_rl, _stdout, _fitInTTY)(2)
      log([null, 'str'])
      expect(_stdout.write).toHaveBeenLastCalledWith('str')
    });

    it('should call clearLine with correct params', () => {
      const log = __logger(_rl, _stdout, _fitInTTY)(2)
      log([null, 'str'])
      expect(_rl.clearLine).toHaveBeenLastCalledWith(_stdout, 1)
    });

  });

});
