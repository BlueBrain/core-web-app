/**
 * Convert an opacque hexadecimal color into one understood by Brayns.
 */
export default function convertStringColorIntoArrayColor(
  color: string
): [red: number, green: number, blue: number, alpha: number] {
  const alpha = 0.02;
  if (color.charAt(0) !== '#') return [1, 1, 1, alpha];

  if (color.length < '#FFFFFF'.length) {
    const r = parseInt(color.substring(1, 2), 16) / 15;
    const g = parseInt(color.substring(2, 3), 16) / 15;
    const b = parseInt(color.substring(3, 4), 16) / 15;
    return [r, g, b, alpha];
  }

  const r = parseInt(color.substring(1, 3), 16) / 255;
  const g = parseInt(color.substring(3, 5), 16) / 255;
  const b = parseInt(color.substring(5, 7), 16) / 255;
  return [r, g, b, alpha];
}
