import { logError } from '@/util/logger';

export async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = () => {
      logError('Unable to load an image from binary data!');
      resolve(new Image());
    };
  });
}
