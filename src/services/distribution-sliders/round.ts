export default function round(value: number, decimalPlaces: number = 0) {
  const exponent = 10 ** decimalPlaces;
  return Math.round(value * exponent) / exponent;
}
