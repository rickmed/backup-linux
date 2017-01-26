const {opts, optAlias, argvToFormatStr} = require('.')

const _opts = opts
_opts.w = {}

describe('optAlias', () => {

  it('returns alias of opt', () => {
    expect(optAlias(_opts)(':a')).toBe(':eta')
  });

  it('returns error NOOPT when opt does not exist', () => {
    expect(optAlias(_opts)(':j').message).toBe('ENOOPT')
  });

  it('returns error ENOALIAS when opt has no alias', () => {
    expect(optAlias(_opts)(':w').message).toBe('ENOALIAS')
  });

});

describe('argvToFormatStr', () => {

  it('returns correct str when format is present', () => {
    const _argv = {
      format: ' :b :percentage  :eta '
    }
    const exp = ' :bar :percentage  :eta '
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

});