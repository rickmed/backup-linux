const {optionPromptImp, optsStr} = require('./option-prompt')

describe('option-prompt', () => {

  describe('optsStr', () => {

    it('should return correct string', () => {
      const act = optsStr(['opt A', 'opt B'], 'some q?')
      const exp = 'some q?\n1) opt A\n2) opt B'
      expect(act).toBe(exp)
    })

  });

  describe('optionPromptImp', () => {

    const mocks = cbVal => ({
      _cb: jest.fn(),
      _rl: {
        createInterface: jest.fn( () => ({
          question: jest.fn( (q, cb) => cb(cbVal) )
        }))
      }
    })
    const input = ['option 1', 'option 2']

    it('should call cb with correct option index on valid answer', () => {
      const {_rl, _cb} = mocks('2 ')
      optionPromptImp(_rl, process)(input, 'question', _cb)
      expect(_cb).toBeCalledWith(1)
    });

    it('should call cb with Err on invalid answer', () => {
      const {_rl, _cb} = mocks('3')
      optionPromptImp(_rl, process)(input, 'question', _cb)
      expect(_cb.mock.calls[0][0]).toBeInstanceOf(Error)
    });

    it('should call rl.question with correct string', () => {
      const exp = `question
1) option 1
2) option 2
> `
      const {_rl, _cb} = {
        _cb: jest.fn(),
        _rl: {
          createInterface: jest.fn( () => ({
            question: jest.fn( (q, cb) => expect(q).toBe(exp) )
          }))
        }
      }
      optionPromptImp(_rl, process)(input, 'question', _cb)
    });

  });

});
