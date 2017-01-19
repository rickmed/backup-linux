const {optionPrompt, optsStr} = require('.')

describe('optionPrompt', () => {

  describe('optsStr', () => {

    it('should return correct string', () => {
      const act = optsStr(['opt A', 'opt B'], 'some q?')
      const exp = 'some q?\n1) opt A\n2) opt B'
      expect(act).toBe(exp)
    })

  });


  it('should return one option', () => {
    const act = optionPrompt(['option 1', 'option 2', 'option 3'])
    const exp = ['option 2']
    expect(act).toBe(exp)
  });

});
