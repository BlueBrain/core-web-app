/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-restricted-syntax */
/* tslint:disable no-magic-numbers */
/* tslint:disable number-literal-format */

import Color from './color';

describe('Tfw.Color', () => {
  describe('mix()', () => {
    it('should work', () => {
      const cases: Array<[string, string, number, string]> = [
        ['#000', '#fff', 0.0, '#000'],
        ['#000', '#fff', 1.0, '#fff'],
        ['#000', '#fff', 0.5, '#7f7f7f'],
        ['#fff', '#000', 0.5, '#7f7f7f'],
      ];
      for (const testCase of cases) {
        const [c1, c2, alpha, expected] = testCase;
        const color = Color.mix(new Color(c1), new Color(c2), alpha);
        expect(color.stringify()).toEqual(new Color(expected).stringify());
      }
    });
  });

  describe('ramp()', () => {
    it('should mimic mix() when only two colors are provided', () => {
      const cases: Array<[string, string, number, string]> = [
        ['#000', '#fff', 0.0, '#000'],
        ['#000', '#fff', 1.0, '#fff'],
        ['#000', '#fff', 0.5, '#7f7f7f'],
        ['#fff', '#000', 0.5, '#7f7f7f'],
      ];
      for (const testCase of cases) {
        const [c1, c2, alpha, expected] = testCase;
        const color = Color.ramp([new Color(c1), new Color(c2)], alpha);
        expect(color.stringify()).toEqual(new Color(expected).stringify());
      }
    });

    it('should take the middle color for alpha==0.5 and 3 colors', () => {
      const cases: Array<[string, string, string]> = [
        ['#000', '#fff', '#000'],
        ['#000', '#123', '#fff'],
        ['#000', '#995', '#7f7f7f'],
        ['#fff', '#Fe560D', '#7f7f7f'],
      ];
      for (const testCase of cases) {
        const [c1, c2, c3] = testCase;
        const colors = [new Color(c1), new Color(c2), new Color(c3)];
        const color = Color.ramp(colors, 0.5);
        expect(color.stringify()).toEqual(colors[1].stringify());
      }
    });
  });

  describe(`luminance()`, () => {
    it(`should be 0 for Black`, () => {
      expect(Color.newBlack().luminance()).toBe(0);
    });
    it(`should be 1 for White`, () => {
      expect(Color.newWhite().luminance()).toBe(1);
    });
    it(`should be 0 for undefined`, () => {
      expect(Color.luminance(undefined)).toBe(0);
    });
  });

  describe(`luminanceStep()`, () => {
    it(`should give 1 for #42fc00`, () => {
      expect(Color.luminanceStep('#42fc00')).toBe(1);
    });
    it(`should give 1 for #b4a23e`, () => {
      expect(Color.luminanceStep('#b4a23e')).toBe(1);
    });
  });

  describe(`contrast()`, () => {
    it(`should give 21 for black on white`, () => {
      expect(Color.contrast('#000', '#fff')).toBeCloseTo(21, 4);
    });
    it(`should give 21 for white on black`, () => {
      expect(Color.contrast('#fff', '#000')).toBeCloseTo(21, 4);
    });
    it(`should give 1.5625 for #b4a23e on white`, () => {
      expect(Color.contrast('#b4a23e', '#fff')).toBeCloseTo(2.568, 3);
    });
    it(`should give 13.4397 for #b4a23e on black`, () => {
      expect(Color.contrast('#b4a23e', '#000')).toBeCloseTo(8.178, 3);
    });
    it(`should give 13.4397 for #1d2ac1 on black`, () => {
      expect(Color.contrast('#1d2ac1', '#000')).toBeCloseTo(2.15, 2);
    });
    it(`should give 13.4397 for #1d2ac1 on white`, () => {
      expect(Color.contrast('#1d2ac1', '#fff')).toBeCloseTo(9.75, 2);
    });
  });

  describe(`bestContrast()`, () => {
    const testCases: Array<[string, string[], number]> = [
      ['#1d2ac1', ['#000', '#fff'], 1],
      ['#2af112', ['#000', '#fff'], 0],
    ];
    for (const testCase of testCases) {
      const [backColor, foreColors, index] = testCase;
      it(`should work for (${backColor} : ${foreColors.join(', ')})`, () => {
        expect(Color.bestContrast(backColor, ...foreColors)).toBe(foreColors[index]);
      });
    }
  });

  describe(`makeTransparent()`, () => {
    it(`should work with alpha = 0.33`, () => {
      expect(Color.makeTransparent('#7abffc', 0.33).stringify()).toBe('#7abffc54');
    });
    it(`should work with alpha = 1`, () => {
      expect(Color.makeTransparent('#7abffc', 1).stringify()).toBe('#7abffc');
    });
  });

  describe(`stringify()`, () => {
    it(`should work with opacity (fromRGBA)`, () => {
      const color = Color.fromRGBA(0.48, 0.75, 0.99, 0.33);
      expect(color.stringify()).toBe('#7abffc54');
    });
    it(`should work with opacity (color.A)`, () => {
      const color = Color.fromRGB(0.48, 0.75, 0.99);
      color.A = 0.33;
      expect(color.stringify()).toBe('#7abffc54');
    });
    for (const level of [
      0, 1, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 254,
      255,
    ]) {
      let hex = level.toString(16);
      if (hex.length < 2) hex = `0${hex}`;

      it(`should be consistent for Red ${hex}`, () => {
        const code = `#${hex}0123`;
        const color = new Color(code);
        expect(color.stringify()).toBe(code);
      });
      it(`should be consistent for Green ${hex}`, () => {
        const code = `#01${hex}23`;
        const color = new Color(code);
        expect(color.stringify()).toBe(code);
      });
      it(`should be consistent for Blue ${hex}`, () => {
        const code = `#0123${hex}`;
        const color = new Color(code);
        expect(color.stringify()).toBe(code);
      });
    }
    it(`should shorten when possible`, () => {
      const color = Color.fromColorOrString('#ccdd99');
      expect(color.stringify()).toBe('#cd9');
    });
    it(`should shorten when possible, even with transparency`, () => {
      const color = Color.fromColorOrString('#ccdd9944');
      expect(color.stringify()).toBe('#cd94');
    });
  });
});
