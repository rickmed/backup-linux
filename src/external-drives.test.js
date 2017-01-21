const {
  externalDrivesImp,
  execFileCB
} = require('./external-drives')

describe('execFileCB', () => {

  it('should call the cb with correct list of external devices', () => {
    const stdout = `{
      "blockdevices": [{
        "name": "sda",
        "size": "232.9G",
        "vendor": "ATA     ",
        "model": "Samsung SSD 840 ",
        "hotplug": "0",
        "label": null,
        "mountpoint": null,
        "children": [{
          "name": "sda10",
          "size": "50.1G",
          "vendor": null,
          "model": null,
          "hotplug": "0",
          "label": null,
          "mountpoint": null
        }]
      }, {
        "name": "sdb",
        "size": "3.8G",
        "vendor": "Generic ",
        "model": "Flash Disk      ",
        "hotplug": "1",
        "label": null,
        "mountpoint": null,
        "children": [{
          "name": "sdb1",
          "size": "3.8G",
          "vendor": null,
          "model": null,
          "hotplug": "1",
          "label": "LINUX MINT",
          "mountpoint": null
        }]
      }, {
        "name": "sdc",
        "size": "465.8G",
        "vendor": "ST500LM0",
        "model": "00-SSHD-8GB     ",
        "hotplug": "1",
        "label": null,
        "mountpoint": null,
        "children": [{
          "name": "sdc5",
          "size": "5.9G",
          "vendor": null,
          "model": null,
          "hotplug": "1",
          "label": "WIN10_MEDIA",
          "mountpoint": null
        }]
      }]
    }`

    const _cb = jest.fn()
    execFileCB(_cb)(null, stdout, null)

    const exp = [{
      model: "Flash Disk      ",
      name: "sdb",
      partitions: [{
        label: "LINUX MINT",
        mountpoint: null,
        name: "sdb1",
        size: "3.8G"
      }],
      size: "3.8G",
      vendor: "Generic "
    }, {
      model: "00-SSHD-8GB     ",
      name: "sdc",
      partitions: [{
        label: "WIN10_MEDIA",
        mountpoint: null,
        name: "sdc5",
        size: "5.9G"
      }],
      size: "465.8G",
      vendor: "ST500LM0"
    }]

    expect(_cb).toHaveBeenLastCalledWith(null, exp)
  });

  it('should call the cb on err with stderr data', () => {
    const _cb = jest.fn()
    execFileCB(_cb)(null, null, 'test')
    expect(_cb).toHaveBeenLastCalledWith('test')
  });

  it('should call the cb with err on execFile err', () => {
    const _cb = jest.fn()
    execFileCB(_cb)('test', null, null)
    expect(_cb).toHaveBeenLastCalledWith('test')
  });

});

describe('externalDrives', () => {

  it('should call execFile with the correct args', () => {
    const _execFile = jest.fn()
    const _isRoot = jest.fn(() => true)
    externalDrivesImp(_execFile, _isRoot)(() => '')
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
    const expLastArg = execFileCB(() => '').toString()
    const actFirs3Args = _execFile.mock.calls[0].slice(0, 3)
    const actLastArg = _execFile.mock.calls[0][3].toString()
    expect(actFirs3Args).toEqual(expFirs3Args)
    expect(actLastArg).toBe(expLastArg)
  });

  it('should call cb with err if process was not ran as root', () => {
    const _cb = jest.fn()
    const _execFile = jest.fn()
    const _isRoot = jest.fn(() => false)
    externalDrivesImp(_execFile, _isRoot)(_cb)
    expect(_cb.mock.calls[0][0]).toBeInstanceOf(Error)
  });

});
