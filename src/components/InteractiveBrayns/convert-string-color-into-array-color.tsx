export default function convertStringColorIntoArrayColor(
  color: string
): [red: number, green: number, blue: number, alpha: number] {
  // We will need to convert the string color into a Brayns one.
  console.log('Color defined in the Atlas:', color);
  return [1, 0.5, 0, 0.1];
}
