import { logError } from '@/util/logger';

const LUMINANCE_THRESHOLD = 0.62;
const HALF = 0.5;
const EPSILON = 0.000001;
const MAX_BYTE_VALUE = 255;
const VAL_1 = 1;
const VAL_2 = 2;
const VAL_3 = 3;
const VAL_4 = 4;
const VAL_5 = 5;
const VAL_6 = 6;
const VAL_7 = 7;
const VAL_15 = 15;
const VAL_99 = 99;
const VAL_359 = 359;
const INV_6 = 1 / VAL_6;
const INV_15 = 1 / VAL_15;
const INV_99 = 1 / VAL_99;
const INV_255 = 1 / MAX_BYTE_VALUE;
const INV_359 = 1 / VAL_359;
const INVALID_COLOR = -1;
const RX_RGB = /^RGB[\s(?:]+(?:[0-9]+)[^0-9]+(?:[0-9]+)[^0-9]+(?:[0-9]+)/u;
const RX_RGBA = /^RGBA[\s(?:]+(?:[0-9]+)[^0-9]+(?:[0-9]+)[^0-9]+(?:[0-9]+)[^0-9.]+(?:[0-9.]+)/u;
const RX_HSL = /^HSL[\s(?:]+(?:[0-9]+)[^0-9]+(?:[0-9]+)[^0-9]+(?:[0-9]+)/u;

export type ColorOrString = Color | string;

/**
 * Fast color manipulations.
 * Attributes R  (red), G  (green), B  (blue), A  (alpha), H  (hue), S
 * (saturation), and L (luminance) are all floats between 0 and 1.
 */
export default class Color {
  public static fromColorOrString(colorOrString?: ColorOrString): Color {
    if (!colorOrString) return Color.newBlack();
    if (colorOrString instanceof Color) return colorOrString;
    return new Color(colorOrString);
  }

  public static fromArrayRGB(rgb: [number, number, number]): Color {
    if (!Array.isArray(rgb)) {
      logError('Invalid param rgb: ', rgb);
      return Color.fromRGB(0, 0, 0);
    }
    const MIN_LEN = 3;
    while (rgb.length < MIN_LEN) rgb.push(0);
    const [R, G, B] = rgb;

    return Color.fromRGB(R, G, B);
  }

  public static fromArrayRGBA(rgba: [number, number, number, number]): Color {
    if (!Array.isArray(rgba)) {
      logError('Invalid param rgba: ', rgba);
      return Color.fromRGB(0, 0, 0);
    }
    const MIN_LEN = 4;
    while (rgba.length < MIN_LEN) rgba.push(1);
    const [R, G, B, A] = rgba;

    return Color.fromRGBA(R, G, B, A);
  }

  /**
   *
   * @param hue Hue between 0 and 1.
   * @param saturation Saturation between 0 and 1.
   * @param luminance Luminance between 0 (black) and 1 (white).
   * @returns
   */
  public static fromHSL(hue: number, saturation: number, luminance: number): Color {
    const color = new Color();
    color.H = modulo01(hue);
    color.S = clamp01(saturation);
    color.L = clamp01(luminance);
    color.hsl2rgb();
    return color;
  }

  public static fromHSLA(hue: number, saturation: number, luminance: number, alpha: number): Color {
    const color = new Color();
    color.H = hue;
    color.S = saturation;
    color.L = luminance;
    color.hsl2rgb();
    color.A = alpha;
    return color;
  }

  /**
   * Check if a CSS stle string is an actual color.
   */
  public static isValid(codeCSS: unknown): codeCSS is string {
    if (typeof codeCSS !== 'string') return false;
    if (codeCSS.charAt(0) !== '#') return false;
    switch (codeCSS.length) {
      case '#RGB'.length:
      case '#RGBA'.length:
      case '#RRGGBB'.length:
      case '#RRGGBBAA'.length:
        return true;
      default:
        return false;
    }
  }

  /**
   * @see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
   */
  public static contrast(
    background: ColorOrString | undefined,
    foreground: ColorOrString | undefined
  ): number {
    const backColor = Color.fromColorOrString(background);
    const color2 = Color.fromColorOrString(foreground);
    const foreColor = Color.mix(backColor, color2, color2.A);
    const lum1 = backColor.luminance();
    const lum2 = foreColor.luminance();
    const CONTRAST_EPSILON = 0.05;
    if (lum1 > lum2) {
      return (lum1 + CONTRAST_EPSILON) / (lum2 + CONTRAST_EPSILON);
    }
    return (lum2 + CONTRAST_EPSILON) / (lum1 + CONTRAST_EPSILON);
  }

  /**
   * Return the color with better contrast on a given surface.
   *
   * @param backColor Color of the background surface.
   * @param foreColors Possible colors for a text on this surface.
   */
  public static bestContrast<T extends Color | string>(
    backColor: ColorOrString,
    ...foreColors: T[]
  ): T {
    const realBackColor = Color.fromColorOrString(backColor);
    let bestContrast = 0;
    let bestForeColorIndex = -1;
    let index = 0;
    for (const foreColor of foreColors) {
      const contrast = Color.contrast(realBackColor, foreColor);
      if (contrast > bestContrast) {
        bestContrast = contrast;
        bestForeColorIndex = index;
      }
      index += 1;
    }

    return foreColors[bestForeColorIndex];
  }

  /**
   * return luminance between 0 (darkest) and 1 (brightest).
   * If the color is invalid, return -1.
   */
  public static luminance(colorOrString: ColorOrString | undefined): number {
    if (typeof colorOrString === 'undefined') return 0;
    return Color.fromColorOrString(colorOrString).luminance();
  }

  /**
   * Returns 1 for bright colors and 0 for dark colors.
   * If the color is invalid, return -1.
   */
  public static luminanceStep(colorOrString: ColorOrString): typeof INVALID_COLOR | 0 | 1 {
    if (!Color.isValid(colorOrString)) return INVALID_COLOR;
    const lum = Color.luminance(colorOrString);
    const CONTRAST_EPSILON = 0.05;
    const blackContrast = (lum + CONTRAST_EPSILON) / CONTRAST_EPSILON;
    const whiteContrast = (CONTRAST_EPSILON + 1) / (lum + CONTRAST_EPSILON);
    return blackContrast > whiteContrast ? 1 : 0;
  }

  public static isDarkColor(colorOrString: ColorOrString) {
    return Color.luminanceStep(colorOrString) === 0;
  }

  public static isLightColor(colorOrString: ColorOrString) {
    return Color.luminanceStep(colorOrString) === 1;
  }

  public static makeDarker(colorOrString: ColorOrString, luminancePercentage = HALF): Color {
    if (luminancePercentage <= 0) return new Color('#000');
    const color = Color.fromColorOrString(colorOrString);
    if (luminancePercentage >= 1) return color;
    return Color.fromHSLA(color.H, color.S, color.L, color.A * luminancePercentage);
  }

  public static makeHueRotated(colorOrString: ColorOrString, rotation = HALF): Color {
    const color = Color.fromColorOrString(colorOrString);
    color.rgb2hsl();
    // The `floor` is used to deal with negative numbers.
    color.H += rotation - Math.floor(rotation);
    if (color.H > 1) color.H -= 1;
    color.hsl2rgb();
    return color;
  }

  public static makeTransparent(colorOrString: ColorOrString, alpha: number) {
    const color = Color.fromColorOrString(colorOrString);
    color.A = clamp01(alpha);
    return color;
  }

  /**
   * Mix two colors. alpha should be between 0 and 1,
   * but there is no check on this.
   * If alpha is 0, the resulting color is `color1`,
   * if alpha is 1, the resulting color is `color2`.
   */
  public static mix(
    colorOrString1: ColorOrString,
    colorOrString2: ColorOrString,
    alpha = HALF
  ): Color {
    const color1 = Color.fromColorOrString(colorOrString1);
    const color2 = Color.fromColorOrString(colorOrString2);
    const beta = 1 - alpha;

    return Color.fromRGBA(
      alpha * color2.R + beta * color1.R,
      alpha * color2.G + beta * color1.G,
      alpha * color2.B + beta * color1.B,
      alpha * color2.A + beta * color1.A
    );
  }

  public static newBlack() {
    return Color.fromRGB(0, 0, 0);
  }

  public static newWhite() {
    return Color.fromRGB(1, 1, 1);
  }

  /**
   * Create a new Color instance base on R,G,B channels.
   *
   * @param   red - Value between 0 and 1.
   * @param   green - Value between 0 and 1.
   * @param   blue - Value between 0 and 1.
   * @returns New instance of Color.
   */
  public static fromRGB(red: number, green: number, blue: number) {
    const color = new Color();
    color.R = red;
    color.G = green;
    color.B = blue;
    color.A = 1;

    return color;
  }

  /**
   * Create a new Color instance base on R,G,B channels.
   *
   * @param   red - Value between 0 and 255.
   * @param   green - Value between 0 and 255.
   * @param   blue - Value between 0 and 255.
   * @returns New instance of Color.
   */
  public static fromByteRGB(red: number, green: number, blue: number) {
    const factor = 1 / 255;
    return Color.fromRGB(red * factor, green * factor, blue * factor);
  }

  /**
   * Create a new Color instance base on R,G,B,A channels.
   *
   * @param   red - Value between 0 and 1.
   * @param   green - Value between 0 and 1.
   * @param   blue - Value between 0 and 1.
   * @param   alpha - Value between 0 and 1.
   * @returns New instance of Color.
   */
  public static fromRGBA(red: number, green: number, blue: number, alpha: number) {
    const color = new Color();
    color.R = red;
    color.G = green;
    color.B = blue;
    color.A = alpha;

    return color;
  }

  public static normalize(codeCSS: string) {
    const color = new Color(codeCSS);

    return color.stringify();
  }

  /**
   * Create an array of colors by interpolating on other colors.
   */
  public static interpolate(colors: Array<Color | string>, arrayLength: number): Color[] {
    if (arrayLength < 1) return [];
    const input = colors.map((c) => (typeof c === 'string' ? new Color(c) : c));
    const result: Color[] = [];

    for (let step = 1; step <= arrayLength; step += 1) {
      const alpha = step / (arrayLength + 1);
      result.push(Color.ramp(input, alpha));
    }
    return result;
  }

  /**
   * If `colors` has only two elements, this method is the same as `mix()`.
   * Otherwise, it will perform a linear blending through the colors.
   * If alpha is 0, the resulting color is `colors[0]`,
   * If alpha is 1, the resulting color is `colors[colors.length - 1]`,
   */
  public static ramp(colors: Color[], alpha = HALF): Color {
    if (colors.length === 0) return Color.newBlack();
    if (colors.length === 1) return colors[0];

    // Number of spaces between colors.
    const spacesCount = colors.length - 1;
    const firstColorIndex = Math.floor(alpha * spacesCount);
    const color1 = colors[firstColorIndex];
    if (firstColorIndex === spacesCount) return color1;
    const color2 = colors[firstColorIndex + 1];
    const translatedAlpha = alpha * spacesCount - firstColorIndex;

    return Color.mix(color1, color2, translatedAlpha);
  }

  /** Alpha [0..1] */
  public A: number;

  /** Blue [0..1] */
  public B: number;

  /** Green [0..1] */
  public G: number;

  /** Hue [0..1] */
  public H: number;

  /** Lumimance [0..1] */
  public L: number;

  /** Red [0..1] */
  public R: number;

  /** Saturation [0..1] */
  public S: number;

  public constructor(codeCSS = '#000000') {
    this.R = 0;
    this.G = 0;
    this.B = 0;
    this.H = 0;
    this.S = 0;
    this.L = 0;
    this.A = 1;

    if (Color.isValid(codeCSS)) {
      this.parse(codeCSS);
    }
  }

  public copy() {
    const newColor = new Color();
    newColor.R = this.R;
    newColor.G = this.G;
    newColor.B = this.B;
    newColor.A = this.A;
    newColor.H = this.H;
    newColor.S = this.S;
    newColor.L = this.L;

    return newColor;
  }

  /**
   * @see https://en.wikipedia.org/wiki/HSL_and_HSV#Converting_to_RGB
   */
  public hsl2rgb() {
    const H = VAL_6 * this.H;
    const { S, L } = this;
    const chroma = (1 - Math.abs(L + L - 1)) * S;
    const { R, G, B } = convertToRGB(H, chroma);
    const shift = L - chroma * HALF;
    this.R = R + shift;
    this.G = G + shift;
    this.B = B + shift;
  }

  /**
   * Compute the luminance of the color.
   * @see https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
   */
  public luminance(): number {
    const { R, G, B } = this;
    const THRESHOLD = 0.03928;
    const ALPHA = 0.07739938080495357; // = 1/12.92
    const SHIFT = 0.055;
    const BETA = 0.9478672985781991; // = 1/1.055
    const GAMMA = 2.4;
    const vR = R < THRESHOLD ? R * ALPHA : ((R + SHIFT) * BETA) ** GAMMA;
    const vG = G < THRESHOLD ? R * ALPHA : ((G + SHIFT) * BETA) ** GAMMA;
    const vB = B < THRESHOLD ? R * ALPHA : ((B + SHIFT) * BETA) ** GAMMA;
    const cR = 0.2126;
    const cG = 0.7152;
    const cB = 0.0722;
    return cR * vR + cG * vG + cB * vB;
  }

  /**
   * @returns 0 if the color is dark and 1 if it is light.
   */
  public luminanceStep(): 0 | 1 {
    return this.luminance() < LUMINANCE_THRESHOLD ? 0 : 1;
  }

  /**
   * Parse a color writtent in CSS syntax.
   *
   * @param   code - CSS color.
   * @returns `true` if the color has valid syntax.
   */
  public parse(code = '#000000'): boolean {
    const input = code.trim().toUpperCase();
    if (this.parseHexa(input)) return true;
    if (this.parseRGB(input)) return true;
    if (this.parseRGBA(input)) return true;
    if (this.parseHSL(input)) return true;

    // @TODO parseHSLA.
    return false;
  }

  public rgb2hsl() {
    const { R, G, B } = this;

    const min = Math.min(R, G, B);
    const max = Math.max(R, G, B);
    const delta = max - min;

    this.L = HALF * (max + min);

    if (delta < EPSILON) {
      this.H = 0;
      this.S = 0;
    } else {
      this.S = delta / (1 - Math.abs(this.L + this.L - 1));
      if (max === R) {
        this.H = G >= B ? INV_6 * ((G - B) / delta) : INV_6 * ((B - G) / delta);
      } else if (max === G) {
        this.H = INV_6 * (VAL_2 + (B - R) / delta);
      } else {
        this.H = INV_6 * (VAL_4 + (R - G) / delta);
      }
    }
  }

  public stringify() {
    let color =
      hexa2(this.R * MAX_BYTE_VALUE) +
      hexa2(this.G * MAX_BYTE_VALUE) +
      hexa2(this.B * MAX_BYTE_VALUE);
    if (this.A < 1) {
      color += hexa2(this.A * MAX_BYTE_VALUE);
    }

    let canBeShorten = true;
    const STEP = 2;
    for (let i = 0; i < color.length; i += STEP) {
      const a = color.charAt(i);
      const b = color.charAt(i + 1);
      if (a !== b) {
        canBeShorten = false;
        break;
      }
    }

    const TWO = 2;
    const FOUR = 4;
    const SIX = 6;

    if (canBeShorten) {
      if (color.length === SIX) {
        color = color.charAt(0) + color.charAt(TWO) + color.charAt(FOUR);
      } else {
        color = color.charAt(0) + color.charAt(TWO) + color.charAt(FOUR) + color.charAt(SIX);
      }
    }

    return `#${color}`;
  }

  public toArrayRGB(): [number, number, number] {
    return [this.R, this.G, this.B];
  }

  public toArrayRGBA(): [number, number, number, number] {
    return [this.R, this.G, this.B, this.A];
  }

  private parseHexa(text: string) {
    if (text.charAt(0) !== '#') return false;
    let R = 0;
    let G = 0;
    let B = 0;
    let A = 1;

    switch (text.length) {
      case '#fff'.length:
        R = parseInt(text.charAt(VAL_1), 16) * INV_15;
        G = parseInt(text.charAt(VAL_2), 16) * INV_15;
        B = parseInt(text.charAt(VAL_3), 16) * INV_15;
        break;
      case '#fff7'.length:
        R = parseInt(text.charAt(VAL_1), 16) * INV_15;
        G = parseInt(text.charAt(VAL_2), 16) * INV_15;
        B = parseInt(text.charAt(VAL_3), 16) * INV_15;
        A = parseInt(text.charAt(VAL_4), 16) * INV_15;
        break;
      case '#ffffff'.length:
        R = parseInt(text.substr(VAL_1, VAL_2), 16) * INV_255;
        G = parseInt(text.substr(VAL_3, VAL_2), 16) * INV_255;
        B = parseInt(text.substr(VAL_5, VAL_2), 16) * INV_255;
        break;
      case '#ffffff77'.length:
        R = parseInt(text.substr(VAL_1, VAL_2), 16) * INV_255;
        G = parseInt(text.substr(VAL_3, VAL_2), 16) * INV_255;
        B = parseInt(text.substr(VAL_5, VAL_2), 16) * INV_255;
        A = parseInt(text.substr(VAL_7, VAL_2), 16) * INV_255;
        break;
      default:
    }

    if (Number.isNaN(R) || Number.isNaN(G) || Number.isNaN(B) || Number.isNaN(A)) {
      this.R = 0;
      this.G = 0;
      this.B = 0;
      this.A = 0;
    } else {
      this.R = R;
      this.G = G;
      this.B = B;
      this.A = A;
    }

    return true;
  }

  /**
   * @param   text - `hsl(200, 140, 50)`
   * @returns `true` if `text` is a valid `hsl()` syntax.
   */
  private parseHSL(text: string) {
    const m = RX_HSL.exec(text);
    if (!m) return false;
    this.H = clamp01(parseInt(m[VAL_1], 10) * INV_359);
    this.S = clamp01(parseInt(m[VAL_2], 10) * INV_99);
    this.L = clamp01(parseInt(m[VAL_3], 10) * INV_99);
    this.A = 1;
    this.hsl2rgb();

    return true;
  }

  /**
   * @param   text - `rgb(200, 140, 50)`
   * @returns `true` if `text` is a valid `rgb()` syntax.
   */
  private parseRGB(text: string) {
    const m = RX_RGB.exec(text);
    if (!m) return false;
    this.R = clamp01(parseInt(m[VAL_1], 10) * INV_255);
    this.G = clamp01(parseInt(m[VAL_2], 10) * INV_255);
    this.B = clamp01(parseInt(m[VAL_3], 10) * INV_255);
    this.A = 1;

    return true;
  }

  /**
   * @param   text - `rgba(200, 140, 50, 0.5)`
   * @returns `true` if `text` is a valid `rgba()` syntax.
   */
  private parseRGBA(text: string) {
    const m = RX_RGBA.exec(text);
    if (!m) return false;
    this.R = clamp01(parseInt(m[VAL_1], 10) * INV_255);
    this.G = clamp01(parseInt(m[VAL_2], 10) * INV_255);
    this.B = clamp01(parseInt(m[VAL_3], 10) * INV_255);
    this.A = clamp01(parseFloat(m[VAL_4]));

    return true;
  }
}

/**
 * This is an helper function for the method `hsl2rgb()`.
 * @param H Hue [0..6]
 * @param chroma Chrominance
 * @param x
 */
function convertToRGB(H: number, chroma: number) {
  let R = 0;
  let G = 0;
  let B = 0;
  const x = chroma * (1 - Math.abs((H % VAL_2) - 1));
  if (H < VAL_3) {
    if (H < VAL_1) {
      R = chroma;
      G = x;
      B = 0;
    } else if (H < VAL_2) {
      R = x;
      G = chroma;
      B = 0;
    } else {
      // H == 2.
      R = 0;
      G = chroma;
      B = x;
    }
  } else if (H < VAL_4) {
    R = 0;
    G = x;
    B = chroma;
  } else if (H < VAL_5) {
    R = x;
    G = 0;
    B = chroma;
  } else {
    R = chroma;
    G = 0;
    B = x;
  }
  return { R, G, B };
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function modulo01(value: number): number {
  if (value < 0) return value + Math.ceil(-value);
  return value < 1 ? value : value - Math.floor(value);
}

const HEXA_RADIX = 16;

function hexa2(value: number) {
  // Warning! The EPSILON below is used to get rid of a Javascript miscalculation
  // which was responsible of (new Color("#f40000")).stringify() === "#f30000".
  let out = Math.min(Math.max(Math.floor(value + EPSILON), 0), MAX_BYTE_VALUE).toString(HEXA_RADIX);
  if (out.length < 'FF'.length) out = `0${out}`;

  return out;
}
