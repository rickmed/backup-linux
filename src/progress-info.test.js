const {
  convertBytes,
  secondsToHuman,
  splitSizeFromUnits,
  eta,
  bar,
  bytesToHuman,
  progressInfo
} = require('./progress-info')

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


describe('secondsToHuman', () => {

  it('returns h, m and s', () => {
    const seconds = 3600 * 2 + (60 * 15) + 10
    expect(secondsToHuman(seconds)).toBe(`2h15m10s`)
  });

  it('returns m and s', () => {
    const seconds = 60 * 2 + 40
    expect(secondsToHuman(seconds)).toBe(`2m40s`)
  });

  it('returns only s', () => {
    const seconds = 54
    expect(secondsToHuman(seconds)).toBe(`54s`)
  });

});


describe('splitSizeFromUnits', () => {

  it('separates scalar from units', () => {
    expect(splitSizeFromUnits('2.4MB/s')).toEqual([2.4, 'MB/s'])
  })

});

describe('eta', () => {

  it('calculates correctly', () => {
    expect(eta('1MB/s', (60 + 30) * Math.pow(10, 6))).toBe('1m30s')
  });

});

describe('bar', () => {

  it('returns string correctly', () => {
    expect(bar(0.49, 20)).toBe('█████████░░░░░░░░░░░')
  });

});

describe('bytesToHuman', () => {

  const units = ['b', 'kB', 'MB', 'GB', 'TB']
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

describe('progressInfo', () => {

  it('returns correct string if bar is in opts', () => {
    const _opts = ':total :bar :rate SOMETR  :percentage :eta :elapsed'
    const _dirSize = 1 * Math.pow(10, 9)  //1GB
    const _rsyncProgress = '544,217,337  97%   1.0MB/s    0:00:02 (xfr#18319, ir-chk=1431/38371)'
    const _width = 50

    const act = progressInfo(_opts)(_dirSize)(_rsyncProgress)(_width)
    expect(act.length).toBe(_width)
    expect(act).toMatchSnapshot()
  });

  it('returns correct string if bar is NOT in opts', () => {
    const _opts = ':total :rate SOMETR  :percentage :eta :elapsed'
    const _dirSize = 1 * Math.pow(10, 9)  //1GB
    const _rsyncProgress = '544,217,337  97%   1.0MB/s    0:00:02 (xfr#18319, ir-chk=1431/38371)'
    const _width = 50

    const act = progressInfo(_opts)(_dirSize)(_rsyncProgress)(_width)
    expect(act).toMatchSnapshot()
  });

})
