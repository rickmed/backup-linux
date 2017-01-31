const { __fitInTTY, __logger } = require('./logger')

describe('fitInTTY', () => {

  const _stderr = {
    columns: 10
  }

  const str1 = "A".repeat(11)
  it(`truncates ${str1} to ${_stderr.columns - 1} chars`, () => {
    expect(__fitInTTY(_stderr)(str1)).toMatchSnapshot()
  });

  const str2 = "B".repeat(9)
  it(`returns the same string ('${str2}')`, () => {
    expect(__fitInTTY(_stderr)(str2)).toMatchSnapshot()
  });

  it('should return its input if it is not a string', () => {
    expect(__fitInTTY(_stderr)(null)).toMatchSnapshot()
  });

});

describe('logger', () => {

  let _rl, _stderr, _fitInTTY
  beforeEach(() => {
    _rl = {
      moveCursor: jest.fn(),
      cursorTo: jest.fn(),
      clearLine: jest.fn()
    }
    _stderr = {
      write: jest.fn()
    }
    _fitInTTY = jest.fn(x => x)
  })

  it('position the cursor correctly', () => {
    __logger(_rl, _stderr, _fitInTTY)(3)
    expect(_rl.moveCursor).toHaveBeenLastCalledWith(_stderr, 0, 2)
  });

  describe('log', () => {

    it('renders data correctly', () => {
      const log = __logger(_rl, _stderr, _fitInTTY)(22121)
      log(['str', 'str'])
      expect(_rl.cursorTo).toHaveBeenLastCalledWith(_stderr, 0)
      expect(_stderr.write).toHaveBeenLastCalledWith('str')
      expect(_rl.clearLine).toHaveBeenLastCalledWith(_stderr, 1)
      expect(_rl.moveCursor).toHaveBeenLastCalledWith(_stderr, 0, 1)
    });

    it('renders correctly when null is passed', () => {
      const log = __logger(_rl, _stderr, _fitInTTY)(23123)
      log([null, null])
      expect(_rl.moveCursor).toHaveBeenLastCalledWith(_stderr, 0, 1)
      expect(_rl.cursorTo).not.toBeCalled()
    });

  });

});
