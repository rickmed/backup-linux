const {__mount, __execCB} = require('./mount-device')

let _cb
beforeEach( () => _cb = jest.fn() )

describe('execCB', () => {

  const SOME_PATH = '/dsad/dasd'
  const SOME_ERR = new Error
  let _rmdir
  beforeEach( () => _rmdir = jest.fn() )

  it('should call rmdir and the cb with correct params on execFile err', () => {
    _rmdir = jest.fn( (str, cb) => cb(SOME_ERR) )
    __execCB(_rmdir)(SOME_PATH, _cb)(SOME_ERR, null, null)
    expect(_cb.mock.calls[0][0].mountDevice).toBeDefined()
  });

  it('should call the cb with correct data if no err or stderr', () => {
    __execCB(_rmdir)(SOME_PATH, _cb)(null, null, null)
    expect(_cb).toHaveBeenLastCalledWith(null, SOME_PATH)
    expect(_rmdir).not.toBeCalled()
  });
});

describe('mount', () => {

  const DEV_NAME = `sdc2`
  let _execFile
  beforeEach( () => _execFile = jest.fn() )

  it('should call cb with correct err msg on mkdir fail', () => {
    const _mkdir = jest.fn( (str, cb) => cb({code: 'EEXIST'}) )
    __mount(_execFile, _mkdir)(DEV_NAME, _cb)
    expect(_cb.mock.calls[0][0].mountDevice).toBeDefined()
  });

  it('should retry mkdir on mkdir fail', () => {
    const _mkdir = jest.fn( (str, cb) => cb({code: 'EEXIST'}) )
    __mount(_execFile, _mkdir)(DEV_NAME, _cb)
    expect(_mkdir.mock.calls.length).toBeGreaterThan(2)
  });

  it('should call cb with mkdir err on mkdir fail', () => {
    const _mkdir = jest.fn( (str, cb) => cb(new Error) )
    __mount(_execFile, _mkdir)(DEV_NAME, _cb)
    expect(_cb.mock.calls[0][0]).toBeInstanceOf(Error)
  });

  it('should call execFile with correct params on mkdir success', () => {
    const _mkdir = jest.fn( (str, cb) => cb(null) )
    __mount(_execFile, _mkdir)(DEV_NAME, _cb)
    const firstCall = _execFile.mock.calls[0]
    expect(firstCall[0]).toBe('mount')
    expect(firstCall[1][0]).toBe(`/dev/${DEV_NAME}`)
    expect(firstCall[1][1]).toMatch(new RegExp(`/tmp/${DEV_NAME}-\\d`))
    expect(firstCall[2].length).toBe(3)
  });

});
