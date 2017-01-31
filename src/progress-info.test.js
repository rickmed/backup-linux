const {
  secondsToHuman,
  splitSizeFromUnits,
  eta,
  bar,
  parseRsyncProgress,
  progressInfo
} = require('./progress-info')


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

  it('returns stalled if rate is 0', () => {
    expect(eta('0.00MB/s', 10)).toBe('Stalled')
  });

});

describe('bar', () => {

  it('returns string correctly', () => {
    expect(bar(0.49, 20)).toBe('█████████░░░░░░░░░░░')
  });

  it('returns empty string when width < 0', () => {
    expect(bar(0.49, -10)).toBe('')
  });

});


describe('parseRsyncProgress', () => {

  it('returns correctly when progress starts with empty', () => {
    const _prog = '  217,337  97%   1.0MB/s    0:00:02 (xfr#18319, ir-chk=1431/38371)'
    expect(parseRsyncProgress(_prog))
      .toEqual([217337, '1.0MB/s', '0:00:02'])
  });

  it('returns correctly when progress starts with string', () => {
    const _prog = '435,5353,217,337  97%   1.0MB/s    0:00:02 (xfr#18319, ir-chk=1431/38371)'
    expect(parseRsyncProgress(_prog))
      .toEqual([4355353217337, '1.0MB/s', '0:00:02'])
  });


});


describe('progressInfo', () => {

  it('returns correct string if bar is in opts', () => {
    const _opts = ':total :bar :rate SOMETR  :percentage :eta :elapsed'
    const _dirSize = 1 * Math.pow(10, 9)  //1GB
    const _rsyncProgress = '544,217,337  97%   1.0MB/s    0:00:02 (xfr#18319, ir-chk=1431/38371)'
    const _width = 50

    const act = progressInfo(_opts)(_dirSize)(_rsyncProgress)(_width)
    expect(act.length).toBe(_width - 2)
    expect(act).toMatchSnapshot()
  });

  it('returns correct string if bar is NOT in opts', () => {
    const _opts = ':total :rate SOMETR  :percentage :eta :elapsed'
    const _dirSize = 1 * Math.pow(10, 9)  //1GB
    const _rsyncProgress = '544,217,337  97%   1.0MB/s    0:00:02 (xfr#18319, ir-chk=1431/38371)'
    const _width = 50

    const act = progressInfo(_opts)(_dirSize)(_rsyncProgress)(_width)
    expect(act.length).toBeLessThanOrEqual(_width - 2)
    expect(act).toMatchSnapshot()
  });

  it('handles zeros', () => {
    const _opts = ':total :bar :rate SOMETR  :percentage :eta :elapsed'
    const _dirSize = 1 * Math.pow(10, 9)  //1GB
    const _rsyncProgress = '0   0%    0.00kB/s    0:00:00  (xfr#18319, ir-chk=1431/38371)'
    const _width = 55

    const act = progressInfo(_opts)(_dirSize)(_rsyncProgress)(_width)
    expect(act.length).toBe(_width - 2)
    expect(act).toMatchSnapshot()
  });

})
