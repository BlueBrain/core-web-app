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
import { fetchSomaFromNeuroMorphoViz } from './neuro-morpho-viz-service';
import { useSessionAtomValue } from '@/hooks/hooks';
import { classNames } from '@/util/utils';
import { logError } from '@/util/logger';

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
  const session = useSessionAtomValue();
  const refDiv = useRef<HTMLDivElement | null>(null);
  const refMorphoCanvas = useRef(new MorphologyCanvas());
  const morphoCanvas = refMorphoCanvas.current;
  const refGizmoCanvas = useRef(new GizmoCanvas());
  const gizmoCanvas = refGizmoCanvas.current;
  const refCanvas = useRef<HTMLCanvasElement | null>(null);
  const [{ isDarkMode }] = useMorphoViewerSettings(morphoCanvas);
  const [warning, setWarning] = useSignal(10000);

  useEffect(() => {
    morphoCanvas.canvas = refCanvas.current;
    morphoCanvas.swc = swc;
    if (contentUrl) {
      fetchSomaFromNeuroMorphoViz(contentUrl, session?.accessToken)
        .then((data) => {
          if (!data) return;

          morphoCanvas.somaGLB = data;
          morphoCanvas.paint();
        })
        .catch((err) => logError(err));
    }
    gizmoCanvas.attachCamera(morphoCanvas.camera);
    const handleWarning = () => {
      setWarning(true);
    };
    morphoCanvas.eventMouseWheelWithoutCtrl.addListener(handleWarning);
    gizmoCanvas.eventTipClick.addListener(morphoCanvas.interpolateCamera);
    return () => {
      morphoCanvas.eventMouseWheelWithoutCtrl.removeListener(handleWarning);
      gizmoCanvas.eventTipClick.removeListener(morphoCanvas.interpolateCamera);
    };
  }, [morphoCanvas, gizmoCanvas, setWarning, swc, contentUrl, session?.accessToken]);

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
    </div>
  );
}
