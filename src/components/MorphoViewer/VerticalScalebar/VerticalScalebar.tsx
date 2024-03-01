import { useEffect, useRef, useState } from 'react';
import { MorphologyCanvas } from '@bbp/morphoviewer';

import { useMorphoViewerSettings } from '../hooks/settings';
import { classNames } from '@/util/utils';

import styles from './vertical-scalebar.module.css';

export interface VerticalScalebarProps {
  className?: string;
  painter: MorphologyCanvas;
}

export function VerticalScalebar({ className, painter }: VerticalScalebarProps) {
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
          preferedSizeInPixels: 64,
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
  const margin = 2 * fontHeight;
  ctx.font = `${fontHeight}px sans-serif`;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  let y = fontHeight;
  let previousY = y;
  let value = 0;
  while (y < h - margin) {
    const text = `${value}`;
    ctx.fillText(text, fontHeight, y);
    value += scalebar.value;
    ctx.beginPath();
    ctx.moveTo(1, previousY);
    ctx.lineTo(1, y);
    ctx.lineTo(10, y);
    ctx.stroke();
    previousY = y;
    y += scalebar.sizeInPixel;
  }
  ctx.font = `bold ${fontHeight}px sans-serif`;
  ctx.fillText(`[${scalebar.unit}]`, fontHeight, previousY + fontHeight * 2);
}
