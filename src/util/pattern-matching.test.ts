import { checkMatchPatterns } from '@/util/pattern-matching';

describe('util/pattern-matching.ts', () => {
  describe('checkMatchPatterns()', () => {
    it('should match basic strings', () => {
      expect(checkMatchPatterns('a', ['a'])).toBeTruthy();

      expect(checkMatchPatterns('aa', ['a', 'aa'])).toBeTruthy();

      expect(checkMatchPatterns('aa', ['a', 'aaa'])).toBeFalsy();
    });

    it('should handle regular expressions to allow for partial matching', () => {
      expect(checkMatchPatterns('lorem', [/^.ore.$/])).toBeTruthy();

      expect(checkMatchPatterns(' lorem', [/^lorem$/])).toBeFalsy();

      expect(
        checkMatchPatterns('/build/connectome-definition/interactive', [
          '/build/cell-composition',
          /^\/build\/connectome-definition\//,
        ])
      ).toBeTruthy();

      expect(
        checkMatchPatterns('/build/cell-composition/build', [
          '/build/cell-composition',
          /^\/build\/connectome-definition\//,
        ])
      ).toBeFalsy();
    });
  });
});
