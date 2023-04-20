import { assertType } from './type-guards';

describe('util/type-guards.ts', () => {
  describe('assertType()', () => {
    it('should recognize boolean', () => {
      expect(() => assertType(true, 'boolean')).not.toThrow();
      expect(() => assertType(false, 'boolean')).not.toThrow();
      expect(() => assertType(1, 'boolean')).toThrow();
    });
    it('should recognize number', () => {
      expect(() => assertType(3.14, 'number')).not.toThrow();
      expect(() => assertType('3.14', 'number')).toThrow();
    });
    it('should recognize string', () => {
      expect(() => assertType('Hello', 'string')).not.toThrow();
      expect(() => assertType('', 'string')).not.toThrow();
      expect(() => assertType(3.14, 'string')).toThrow();
    });
    it('should recognize null', () => {
      expect(() => assertType(null, 'null')).not.toThrow();
    });
    it('should recognize undefined', () => {
      expect(() => assertType(undefined, 'undefined')).not.toThrow();
    });
    it(`should not confuse null with undefined`, () => {
      expect(() => assertType(undefined, 'null')).toThrow();
    });
    it(`should not confuse undefined with null`, () => {
      expect(() => assertType(null, 'undefined')).toThrow();
    });
  });
});
