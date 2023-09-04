import { compareSets, SetComparaisonResult } from './set';

describe('services/brayns/utils/set.ts', () => {
  describe('compareSets()', () => {
    const cases: Array<[setA: number[], setB: number[], expected: SetComparaisonResult<number>]> = [
      [
        [1, 2, 3],
        [2, 3, 4, 5, 6],
        {
          onlyInA: [1],
          common: [2, 3],
          onlyInB: [4, 5, 6],
        },
      ],
      [
        [1, 2, 3],
        [4, 5, 6],
        {
          onlyInA: [1, 2, 3],
          common: [],
          onlyInB: [4, 5, 6],
        },
      ],
      [
        [1, 2, 3, 4],
        [4, 2, 3, 1],
        {
          onlyInA: [],
          common: [1, 2, 3, 4],
          onlyInB: [],
        },
      ],
      [
        [],
        [],
        {
          onlyInA: [],
          common: [],
          onlyInB: [],
        },
      ],
      [
        [1, 2],
        [3, 1, 2],
        {
          onlyInA: [],
          common: [1, 2],
          onlyInB: [3],
        },
      ],
      [
        [1, 2],
        [],
        {
          onlyInA: [1, 2],
          common: [],
          onlyInB: [],
        },
      ],
    ];
    cases.forEach(([setA, setB, expected]) => {
      it(`should compare array ${setA} with array ${setB}`, () => {
        const got = compareSets(setA, setB);
        expect(got).toEqual(expected);
      });
      it(`should compare set ${setA} with set ${setB}`, () => {
        const got = compareSets(new Set(setA), new Set(setB));
        expect(got).toEqual(expected);
      });
    });
  });
});
