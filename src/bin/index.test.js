const {
  optOfAlias,
  argvToFormatStr
} = require('.')


describe('optOfAlias', () => {

  it('return opt of an alias', () => {
    expect(optOfAlias('elapsed')).toBe('t')
  });

});

describe('argvToFormatStr', () => {

  it('returns correct str when order is present', () => {
    const _argv = {
      _: [],
      e: true,
      eta: true,
      d: false,
      data: false,
      b: false,
      bar: false,
      p: false,
      zee: false,
      r: true,
      rate: true,
      t: false,
      elapsed: false,
      'no-file': true,
      noFile: true,
      help: false,
      order: '  t --percentage   data  ',
      o: 't p data',
      '$0': 'src/bin/index.js'
    }

    expect(argvToFormatStr(_argv)).toEqual(['t', 'p', 'd'])
  });

  it('returns correct str when order is not', () => {
    const _argv = {
      _: [],
      e: true,
      eta: true,
      d: false,
      data: false,
      b: false,
      bar: false,
      p: false,
      zee: false,
      r: true,
      rate: true,
      t: false,
      elapsed: false,
      'no-file': true,
      noFile: true,
      help: false,
      o: undefined,
      '$0': 'src/bin/index.js'
    }

    expect(argvToFormatStr(_argv)).toEqual(['e', 'r'])
  });

});