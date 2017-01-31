const { opts } = require('./bin/yargs_opts')
const {
  optAlias,
  argvToFormatStr,
  formatDevInfo,
  devName,
  excludeDirs,
  convertBytes,
  bytesToHuman
} = require('./utils')

const _opts = opts
_opts.w = {}

describe('optAlias', () => {

  it('returns alias of opt', () => {
    expect(optAlias(_opts)(':a')).toBe(':eta')
  });

  it('returns input when opt does not exist', () => {
    expect(optAlias(_opts)(':j')).toBe(':j')
  });

  it('returns input when opt has no alias', () => {
    expect(optAlias(_opts)(':w')).toBe(':w')
  });

});

describe('argvToFormatStr', () => {

  it('returns correct str when format is present', () => {
    const _argv = {
      format: ' :b :percentage   :TEST :eta '
    }
    const exp = ' :bar :percentage   :TEST :eta '
    expect(argvToFormatStr(_opts)(_argv)).toBe(exp)
  });

  it('returns correct str when format is not present', () => {
    const _argv = {
      _: [],
      a: true,
      eta: true,
      t: true,
      total: true,
      b: true,
      bar: true,
      p: false,
      percentage: false,
      r: true,
      rate: true,
      e: true,
      elapsed: true,
      file: false,
      help: false,
      f: undefined,
      '$0': 'src/bin/index.js'
    }

    const exp = ':total :bar :rate :eta :elapsed'
    expect(argvToFormatStr(_opts)(_argv)).toBe(exp)
  });

  it('returns default format when no opts are received', () => {
    const _argv = { a: false }
    const exp = ':total :bar :percentage :rate :eta :elapsed'
    expect(argvToFormatStr(_opts)(_argv)).toBe(exp)
  });


});


describe('formatDevInfo', () => {

  it('returns array of correct formatted strings', () => {
    const _devInfo = [{
        "vendor": "Generic ",
        "model": "Flash Disk      ",
        "size": "3.8G",
        "name": "sdc",
        "partitions": [{
          "name": "sdc1",
          "size": "3.8G",
          "label": "LINUX MINT",
          "mountpoint": null
        }]
      },
      {
        "vendor": "ST500LM0",
        "model": "00-SSHD-8GB     ",
        "size": "465.8G",
        "name": "sdd",
        "partitions": [{
            "name": "sdd3",
            "size": "1K",
            "label": null,
            "mountpoint": null
          },
          {
            "name": "sdd4",
            "size": "62.9G",
            "label": "LNX_BACKUPS",
            "mountpoint": null
          }
        ]
      }
    ]

    expect(formatDevInfo(_devInfo)).toMatchSnapshot()
  });

});

describe('devName', () => {

  it('returns the device path', () => {
    const str = "sdd41 LNX_BACKUPS 62.9G in ST500LM0 00-SSHD-8GB "
    expect(devName(str)).toBe('sdd41')
  });

});

describe('excludeDirs', () => {

  it('returns populated exclude array', () => {
    const PATTERNS = ["/proc/*", "/sys/*"]
    expect(excludeDirs(PATTERNS)).toMatchSnapshot()
  });

});

describe('bytesToHuman', () => {

  const units = ['kB', 'MB', 'GB', 'TB']
  const size = 1234
  const sample = [
    size,
    size * 1000,
    size * 1000000,
    size * 1000000000
  ]

  units.forEach( (x, i) => {
    const unit = units[i]
    it(`formats correctly to ${unit}`, () => {
      expect(bytesToHuman(sample[i])).toEqual(`1.2${unit}`)
    });
  })

});

describe('convertBytes', () => {

  const units = ['kB', 'm', 'GB', 'tb']

  it(`coverts from bytes correctly`, () => {
    const bytes = 1234
    const converted = [
      bytes / 1000,
      bytes / 1000000,
      bytes / 1000000000,
      bytes / 1000000000000
    ]
    expect(units.map(x => convertBytes(x, bytes))).toEqual(converted)
  });

  it(`coverts to bytes correctly`, () => {
    const bytes = 123
    const converted = [
      bytes * 1000,
      bytes * 1000000,
      bytes * 1000000000,
      bytes * 1000000000000
    ]
    expect(units.map(x => convertBytes(x, bytes))).toEqual(converted)
  });

  it(`return input if unit is unsupported`, () => {
    const bytes = 123
    expect(convertBytes('ZB', bytes)).toEqual(bytes)
  });

  it(`return input if unit is bytes`, () => {
    const bytes = 123
    expect(convertBytes('B', bytes)).toEqual(bytes)
  });

});