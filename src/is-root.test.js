const {isRoot} = require('.')

describe('is-root', () => {

  process.__getuid = process.getuid
  afterEach( () => process.getuid = process.__getuid)

  it('should return error if not in POSIX', () => {
    process.getuid = undefined
    expect(isRoot()).toEqual(Error('You are not in a POSIX system'))
  });

  it('should return true if root', () => {
    process.getuid = () => 0
    expect(isRoot()).toBe(true)
  });

  it('should return false if not root', () => {
    process.getuid = () => 1000
    expect(isRoot()).toBe(false)
  });

});

