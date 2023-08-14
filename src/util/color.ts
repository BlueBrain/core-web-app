import chroma from 'chroma-js';

export function textColor(bgColor: string) {
  if (!chroma.valid(bgColor)) {
    throw new Error(`Can not parse color string: ${bgColor}`);
  }

  const [r, g, b] = chroma(bgColor).rgb();

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? 'black' : 'white';
}
