'use client';

/* eslint-disable no-param-reassign */
import { useEffect, useRef } from 'react';
import { MorphologyPainter } from '@bbp/morphoviewer';

import { FullscreenOutlined } from '@ant-design/icons';
import { useSignal } from './hooks/signal';
import { Warning } from './Warning';
import { Settings } from './Settings';
import { useMorphoViewerSettings } from './hooks/settings';
import { VerticalScalebar } from './VerticalScalebar';
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
  const painter = refPainter.current;
  const refCanvas = useRef<HTMLCanvasElement | null>(null);
  const [{ isDarkMode }] = useMorphoViewerSettings(painter);
  const [warning, setWarning] = useSignal(10000);

  useEffect(() => {
    painter.canvas = refCanvas.current;
    painter.swc = swc;
    const handleWarning = () => {
      setWarning(true);
    };
    painter.eventMouseWheelWithoutCtrl.addListener(handleWarning);
    return () => painter.eventMouseWheelWithoutCtrl.removeListener(handleWarning);
  }, [painter, setWarning, swc]);

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

  return (
    <div
      className={classNames(styles.main, className, isDarkMode && styles.darkMode)}
      ref={refDiv}
      onDoubleClick={handleFullscreen}
    >
      <canvas ref={refCanvas}>MorphologyViewer</canvas>
      <Settings painter={painter} />
      <button
        className={styles.fullscreenButton}
        type="button"
        onClick={handleFullscreen}
        aria-label="Toggle fullscreen"
      >
        <FullscreenOutlined />
      </button>
      <VerticalScalebar painter={painter} />
      <Warning visible={warning} />
    </div>
  );
}
