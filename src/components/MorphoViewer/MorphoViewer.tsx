/* eslint-disable no-param-reassign */
import { useEffect, useRef, useState } from 'react';
import { MorphologyPainter, ColoringType } from '@bbp/morphoviewer';

import { Scalebar } from './Scalebar';
import { useSignal } from './hooks/signal';
import { Warning } from './Warning';
import { ColorsLegend } from './ColorsLegend';
import { classNames } from '@/util/utils';

import styles from './morpho-viewer.module.css';

export interface MorphoViewerProps {
  className?: string;
  /**
   * Text content of a SWC file.
   */
  swc: string;
}

export function MorphoViewer({ className, swc }: MorphoViewerProps) {
  const refDiv = useRef<HTMLDivElement | null>(null);
  const refPainter = useRef(new MorphologyPainter());
  const [radiusMultiplier, setRadiusMultiplier] = useRadiusMultiplier(refPainter.current, 1);
  const [radiusType, setRadiusType] = useRadiusType(refPainter.current, 0);
  const [colorBy, setColorBy] = useColorBy(refPainter.current, 'section');
  const refCanvas = useRef<HTMLCanvasElement | null>(null);
  const [warning, setWarning] = useSignal(3000);

  useEffect(() => {
    const painter = refPainter.current;
    painter.canvas = refCanvas.current;
    painter.swc = swc;
    painter.colors.background = '#fff';
    painter.colors.soma = '#000';
    painter.colors.axon = '#05f';
    painter.colors.basalDendrite = '#f00';
    painter.colors.apicalDendrite = '#f0f';

    const handleWarning = () => {
      setWarning(true);
    };
    painter.eventMouseWheelWithoutCtrl.addListener(handleWarning);
    return () => painter.eventMouseWheelWithoutCtrl.removeListener(handleWarning);
  }, [setWarning, swc]);

  const otherColoringMethod: ColoringType = colorBy === 'section' ? 'distance' : 'section';
  const handleFullscreen = () => {
    const div = refDiv.current;
    if (!div) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      div.requestFullscreen({
        navigationUI: 'hide',
      });
    }
  };
  const handleResetCamera = () => {
    refPainter.current.resetCamera();
  };

  return (
    <div
      className={classNames(styles.main, className)}
      ref={refDiv}
      onDoubleClick={handleFullscreen}
    >
      <canvas ref={refCanvas}>MorphologyViewer</canvas>
      <Scalebar className={styles.scalebar} painter={refPainter.current} />
      <ColorsLegend className={styles.legend} painter={refPainter.current} />
      <footer>
        <button type="button" onClick={() => setColorBy(otherColoringMethod)}>
          <div>
            Color by <b>{otherColoringMethod}</b>
          </div>
        </button>
        <button type="button" onClick={handleResetCamera} title="Reset camera">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>axis-arrow</title>
            <path d="M12,2L16,6H13V13.85L19.53,17.61L21,15.03L22.5,20.5L17,21.96L18.53,19.35L12,15.58L5.47,19.35L7,21.96L1.5,20.5L3,15.03L4.47,17.61L11,13.85V6H8L12,2Z" />
          </svg>
          <div>Reset camera</div>
        </button>
        <button type="button" onClick={handleFullscreen} title="Toggle fullscreen">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>fullscreen</title>
            <path d="M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z" />
          </svg>
          <div>Full screen</div>
        </button>
        <div className={styles.grid}>
          <div>Thickness:</div>
          <div>{(100 * radiusMultiplier).toFixed(0)} %</div>
          <input
            type="range"
            min={0.5}
            max={5}
            step={0.01}
            value={radiusMultiplier}
            onChange={(evt) => setRadiusMultiplier(Number(evt.target.value))}
          />
        </div>
        <div className={styles.grid}>
          <div>Variable</div>
          <div>Constant</div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={radiusType}
            onChange={(evt) => setRadiusType(Number(evt.target.value))}
          />
        </div>
      </footer>
      <Warning visible={warning} onClose={() => setWarning(false)}>
        Hold Ctrl key to zoom
      </Warning>
    </div>
  );
}

function useRadiusMultiplier(
  painter: MorphologyPainter,
  value: number
): [number, (value: number) => void] {
  const [radiusMultiplier, setRadiusMultiplier] = useState(value);
  useEffect(() => {
    painter.radiusMultiplier = radiusMultiplier;
  }, [painter, radiusMultiplier]);
  return [radiusMultiplier, setRadiusMultiplier];
}

function useRadiusType(
  painter: MorphologyPainter,
  value: number
): [number, (value: number) => void] {
  const [radiusType, setRadiusType] = useState(value);
  useEffect(() => {
    painter.radiusType = radiusType;
  }, [painter, radiusType]);
  return [radiusType, setRadiusType];
}

function useColorBy(
  painter: MorphologyPainter,
  value: ColoringType
): [ColoringType, (value: ColoringType) => void] {
  const [colorBy, setColorBy] = useState(value);
  useEffect(() => {
    painter.colorBy = colorBy;
  }, [colorBy, painter]);
  return [colorBy, setColorBy];
}
