export type Volts = 'mV' | 'V';

export type Amperes = 'pA' | 'nA' | 'A';

/**
 * Convert volts to millivolts
 * 1 V = 1 000 mV
 * @param {array<number>} array of values
 * @param {string} desirable units
 * @return {array<number>} array of converted values
 */
export const convertVolts = (values: number[], toUnits: Volts) => {
  switch (toUnits) {
    case 'mV':
      return values.map((value: number) => value * 1000);
    case 'V':
    default:
      return values;
  }
};

/**
 * Convert amperes to picoamperes or nanoamperes
 * 1 A = 1 000 000 000 000 pA
 * 1 A = 1 000 000 000 nA
 * @param {array<number>} array of values
 * @param {string} desirable units
 * @return {array<number>} array of converted values
 */
export const convertAmperes = (values: number[], toUnits: Amperes) => {
  switch (toUnits) {
    case 'pA':
      return values.map((value: number) => value * 10 ** 12);
    case 'nA':
      return values.map((value: number) => value * 10 ** 9);
    case 'A':
    default:
      return values;
  }
};
