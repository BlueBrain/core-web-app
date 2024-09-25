import { roundToSignificantFigures } from './single-neuron';

describe('single-neuron', () => {
  it('rounds whole numbers to 4 significant numbers', () => {
    const numberToRound = 1234567;
    const gotten = roundToSignificantFigures(numberToRound, 4);
    expect(gotten).toEqual(1235000);
  });

  it('rounds float numbers to 4 significant numbers', () => {
    const numberToRound = 1234.0284;
    const gotten = roundToSignificantFigures(numberToRound, 4);
    expect(gotten).toEqual(1234);
  });

  it('rounds float numbers less than 1.0 to 4 significant numbers', () => {
    const numberToRound = 0.080691;
    const gotten = roundToSignificantFigures(numberToRound, 4);
    expect(gotten).toEqual(0.08069);
  });

  it('rounds up float numbers less than 1.0 to 4 significant numbers', () => {
    const numberToRound = 0.080698;
    const gotten = roundToSignificantFigures(numberToRound, 4);
    expect(gotten).toEqual(0.0807);
  });

  it('correctly deals with whole numbers that dont have 4 significant numbers', () => {
    const numberToRound = 123;
    const gotten = roundToSignificantFigures(numberToRound, 4);
    expect(gotten).toEqual(123);
  });

  it('correctly deals with float numbers that dont have 4 significant numbers', () => {
    const numberToRound = 1.06;
    const gotten = roundToSignificantFigures(numberToRound, 4);
    expect(gotten).toEqual(1.06);
  });
});
