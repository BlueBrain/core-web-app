'use client';

/* eslint-disable no-param-reassign */
import { GizmoCanvas, MorphologyCanvas } from '@bbp/morphoviewer';
import { FullscreenOutlined } from '@ant-design/icons';
import { useEffect, useRef } from 'react';

import { ColorRamp } from './ColorRamp';
import { Settings } from './Settings';
import { VerticalScalebar } from './VerticalScalebar';
import { Warning } from './Warning';
import { useMorphoViewerSettings } from './hooks/settings';
import { useSignal } from './hooks/signal';
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
  const refMorphoPainter = useRef(new MorphologyCanvas());
  const morphoPainter = refMorphoPainter.current;
  const refGizmoCanvas = useRef(new GizmoCanvas());
  const gizmoPainter = refGizmoCanvas.current;
  const refCanvas = useRef<HTMLCanvasElement | null>(null);
  const [{ isDarkMode }] = useMorphoViewerSettings(morphoPainter);
  const [warning, setWarning] = useSignal(10000);

  useEffect(() => {
    morphoPainter.canvas = refCanvas.current;
    morphoPainter.swc = swc;
    morphoPainter.minRadius = 0.25;
    const handleWarning = () => {
      setWarning(true);
    };
    const handleOrbit = () => {
      const { camera } = morphoPainter;
      if (!camera) return;

      gizmoPainter.updateOrientationFrom(camera);
    };
    morphoPainter.eventMouseWheelWithoutCtrl.addListener(handleWarning);
    morphoPainter.orbiter?.eventOrbitChange.addListener(handleOrbit);
    gizmoPainter.eventTipClick.addListener(morphoPainter.resetCamera);
    return () => {
      morphoPainter.eventMouseWheelWithoutCtrl.removeListener(handleWarning);
      morphoPainter.orbiter?.eventOrbitChange.removeListener(handleOrbit);
      gizmoPainter.eventTipClick.removeListener(morphoPainter.resetCamera);
    };
  }, [morphoPainter, gizmoPainter, setWarning, swc]);

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
      data-testid="morpho-viewer"
    >
      <canvas className={styles.morphoViewer} ref={refCanvas}>
        MorphologyViewer
      </canvas>
      <Settings painter={morphoPainter} />
      <button
        className={styles.fullscreenButton}
        type="button"
        onClick={handleFullscreen}
        aria-label="Toggle fullscreen"
      >
        <FullscreenOutlined />
      </button>
      <div className={styles.rightPanel}>
        <canvas
          className={styles.gizmo}
          ref={(canvas) => {
            gizmoPainter.canvas = canvas;
          }}
        >
          GizmoViewer
        </canvas>
        <ColorRamp painter={morphoPainter} />
        <VerticalScalebar painter={morphoPainter} />
      </div>
      <Warning visible={warning} />
    </div>
  );
}
