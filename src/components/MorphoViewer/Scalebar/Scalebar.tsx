import { useEffect, useRef, useState } from 'react';
import { MorphologyCanvas } from '@bbp/morphoviewer';

import { useMorphoViewerSettings } from '../hooks/settings';
import { classNames } from '@/util/utils';

import styles from './scalebar.module.css';

export interface VerticalScalebarProps {
  className?: string;
  painter: MorphologyCanvas;
}

export function Scalebar({ className, painter }: VerticalScalebarProps) {
  const [settings] = useMorphoViewerSettings(painter);
  const ref = useRef<HTMLCanvasElement | null>(null);
  const scalebar = useScalebar(painter);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !scalebar) return;

    paint(canvas, scalebar, settings.isDarkMode ? '#fffe' : '#000e');
  }, [scalebar, settings]);

  if (!scalebar) return null;

  return (
    <div className={classNames(styles.main, className)}>
      <canvas ref={ref} />
    </div>
  );
}

interface ScalebarAttributes {
  sizeInPixel: number;
  value: number;
  unit: string;
}

function useScalebar(painter: MorphologyCanvas): ScalebarAttributes | null {
  const [scalebar, setScalebar] = useState(painter.computeScalebar());
  useEffect(() => {
    const update = () => {
      setScalebar(
        painter.computeScalebar({
          preferedSizeInPixels: 256,
        })
      );
    };
    painter.eventPixelScaleChange.addListener(update);
    return () => painter.eventPixelScaleChange.removeListener(update);
  }, [painter]);
  return scalebar;
}

function paint(canvas: HTMLCanvasElement, scalebar: ScalebarAttributes, color: string) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  // eslint-disable-next-line no-param-reassign
  canvas.width = w;
  // eslint-disable-next-line no-param-reassign
  canvas.height = h;
  const fontHeight = 16;
  const margin = fontHeight / 4;
  ctx.font = `${fontHeight}px sans-serif`;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  // For the line to be one precise pixel, we need to
  // set its x coordinate to 1/2. Otherwise, it will
  // be blured accross to consecutive pixels.
  let x = 0.5;
  const y = (fontHeight + h) / 2;
  let value = 0;
  while (x < w) {
    if (value === 0) {
      ctx.font = `bold ${fontHeight}px sans-serif`;
      ctx.fillText(`[${scalebar.unit}]`, x + margin, y);
    } else {
      ctx.font = `${fontHeight}px sans-serif`;
      const text = `${value}`;
      ctx.fillText(text, x + margin, y);
    }
    value += scalebar.value;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
    x += scalebar.sizeInPixel;
  }
}
