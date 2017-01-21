const {optionPromptImp, optsStr, handler} = require('./option-prompt')

describe('option-prompt', () => {

  const opts = ['option 1', 'option 2']

  describe('handler', () => {

    let _cb, _rl
    beforeEach( () => {
      _cb = jest.fn()
      _rl = {
        close: jest.fn()
      }
    })

    it('should call cb with correct params on valid answer', () => {
      handler(_rl, opts, _cb)('2 ')
      expect(_cb).toHaveBeenLastCalledWith(null, 1)
    });

    it('should call cb with Err on invalid answer', () => {
      handler(_rl, opts, _cb)('3')
      expect(_cb.mock.calls[0][0]).toBeInstanceOf(Error)
    });

    it('should close the readline interface', () => {
      handler(_rl, opts, _cb)('whatever')
      expect(_rl.close).toHaveBeenCalledTimes(1)
    });

  });

  describe('optionPromptImp', () => {

    it('should call rl.question with the correct params', (done) => {
      const exp = `question
1) option 1
2) option 2
> `
      const _readline = {
        createInterface: jest.fn( () => ({
          question: jest.fn( (q, cb) => {
            expect(q).toBe(exp)
            expect(cb).toBeInstanceOf(Function)
            expect(cb.length).toBe(1)
            done()
          })
        }))
      }
      optionPromptImp(_readline, process)(opts, 'question', 'whatever')
    });

  });

});
