const { mountDeviceImp, execHandlerImp } = require('./external-drives')

describe('external-drives', () => {

  describe('execHandlerImp', () => {

    const somePath = '/dsad/dasd'
    const someErr = 'someErr'

    it('should call the cb with correct data if no err or stderr', () => {
      const _cb = jest.fn()
      execHandlerImp(somePath, _cb)(null, null, null)
      expect(_cb).toBeCalledWith(null, somePath)
    });

    it('should call the cb with err on execFile err', () => {
      const _cb = jest.fn()
      execHandlerImp(somePath, _cb)(someErr, null, null)
      expect(_cb).toBeCalledWith(someErr)
    });

  });

  describe('mountDevice', () => {

    let _cb, _execFile, _mkdir
    beforeEach(() => {
      _cb = jest.fn()
      _execFile = jest.fn()
      _mkdir = jest.fn()
    })

    it('should call execFile with the correct args on success', () => {



      mountDeviceImp(_execFile, _mkdir)('sdb1')



      const _execFile = jest.fn()
      const _isRoot = jest.fn(() => true)
      const expFirs3Args = [
        'lsblk',
        [
          '--nodeps',
          '--output=NAME,SIZE,VENDOR,MODEL,HOTPLUG,LABEL,MOUNTPOINT',
          '--json'
        ],
        {
          maxBuffer: 200 * 1024 * 1024
        }
      ]
      const expLastArg = execHandlerImp(() => '').toString()
      const actFirs3Args = _execFile.mock.calls[0].slice(0, 3)
      const actLastArg = _execFile.mock.calls[0][3].toString()
      expect(actFirs3Args).toEqual(expFirs3Args)
      expect(actLastArg).toBe(expLastArg)
    });

    it('should call cb with err if process was not ran as root', () => {
      const _cb = jest.fn()
      const _execFile = jest.fn()
      const _isRoot = jest.fn(() => false)
      mountDeviceImp(_execFile, _isRoot)(_cb)
      expect(_cb.mock.calls[0][0]).toBeInstanceOf(Error)
    });

  });

})