import {
  Sprite as ThreeSprite,
  Texture as ThreeTexture,
  SpriteMaterial as ThreeSpriteMaterial,
  NearestFilter as ThreeNearestFilter,
  Object3D as ThreeObject3D,
} from 'three';

export type TextProps = {
  apparentFontSize?: number;
  fontSize?: number;
  font?: string;
  color?: string;
  align?: CanvasTextAlign;
  baseline?: CanvasTextBaseline;
};

export const createTextCanvas = (text: string, textProps: TextProps) => {
  const {
    fontSize = 48,
    font = 'monospace',
    align = 'center',
    baseline = 'middle',
    color = 'black',
  } = textProps;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  // Prepare the font to be able to measure
  ctx.font = `${fontSize}px ${font}`;

  const textMetrics = ctx.measureText(text);

  const { width } = textMetrics;
  const height = fontSize;

  // Resize canvas to match text size
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  // Re-apply font since canvas is resized.
  ctx.font = `${fontSize}px ${font}`;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;

  // Make the canvas transparent for simplicity
  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = color;
  ctx.fillText(text, width / 2, height / 2);

  return canvas; // eslint-disable-line consistent-return
};

export const makeText = (text: string, textProps: TextProps) => {
  const { apparentFontSize = 5 } = textProps;
  const canvas = createTextCanvas(text, textProps);
  if (!canvas) {
    // eslint-disable-next-line no-console
    console.warn('no canvas found when making text');
    return;
  }
  const texture = new ThreeTexture(canvas);
  texture.magFilter = ThreeNearestFilter;
  texture.needsUpdate = true;
  const material = new ThreeSpriteMaterial({ map: texture });
  const sprite = new ThreeSprite(material);

  const textObject = new ThreeObject3D();

  sprite.scale.set((canvas.width / canvas.height) * apparentFontSize, apparentFontSize, 1);

  sprite.position.set(0, 1.5, 0);

  textObject.add(sprite);
  return textObject; // eslint-disable-line consistent-return
};
