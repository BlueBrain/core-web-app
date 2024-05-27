'use client';

/* eslint-disable no-param-reassign */
import { FullscreenOutlined } from '@ant-design/icons';
import { GizmoCanvas, MorphologyCanvas } from '@bbp/morphoviewer';
import { useEffect, useRef } from 'react';

import { ColorRamp } from './ColorRamp';
import { Scalebar } from './Scalebar';
import { Settings } from './Settings';
import { Warning } from './Warning';
import { useMorphoViewerSettings } from './hooks/settings';
import { useSignal } from './hooks/signal';
import { WaitingForSomaEnhancement } from './WaitingForSomaEnhancement';
import { useEnhancedSomaService } from './hooks/neuro-morpho-viz-service';

import { classNames } from '@/util/utils';
import { useAccessToken } from '@/hooks/useAccessToken';

import styles from './morpho-viewer.module.css';

export interface MorphoViewerProps {
  className?: string;
  /**
   * Text content of a SWC file.
   */
  swc: string;
  contentUrl?: string;
}

export function MorphoViewer({ className, swc, contentUrl }: MorphoViewerProps) {
  const refDiv = useRef<HTMLDivElement | null>(null);
  const refMorphoCanvas = useRef(new MorphologyCanvas());
  const morphoCanvas = refMorphoCanvas.current;
  const refGizmoCanvas = useRef(new GizmoCanvas());
  const gizmoCanvas = refGizmoCanvas.current;
  const refCanvas = useRef<HTMLCanvasElement | null>(null);
  const [{ isDarkMode }] = useMorphoViewerSettings(morphoCanvas);
  const [warning, setWarning] = useSignal(10000);
  const enhancedSomaIsLoading = useEnhancedSomaService(morphoCanvas, contentUrl);

  useEffect(() => {
    morphoCanvas.canvas = refCanvas.current;
    morphoCanvas.swc = swc;
    const handleWarning = () => {
      setWarning(true);
    };
    morphoCanvas.eventMouseWheelWithoutCtrl.addListener(handleWarning);
    gizmoCanvas.attachCamera(morphoCanvas.camera);
    gizmoCanvas.eventTipClick.addListener(morphoCanvas.interpolateCamera);
    return () => {
      morphoCanvas.eventMouseWheelWithoutCtrl.removeListener(handleWarning);
      gizmoCanvas.eventTipClick.removeListener(morphoCanvas.interpolateCamera);
    };
  }, [morphoCanvas, gizmoCanvas, swc, setWarning]);

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
      <Settings painter={morphoCanvas} />
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
            gizmoCanvas.canvas = canvas;
          }}
        >
          GizmoViewer
        </canvas>
        <ColorRamp painter={morphoCanvas} />
      </div>
      <Scalebar painter={morphoCanvas} />
      <Warning visible={warning} />
      <WaitingForSomaEnhancement visible={enhancedSomaIsLoading} />
    </div>
  );
}
