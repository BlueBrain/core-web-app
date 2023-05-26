'use client';

/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { useSession } from 'next-auth/react';
import { useAtomValue } from 'jotai';
import React from 'react';
import { Button } from 'antd';
import useNotification from '../../hooks/notifications';
import AxisGizmo from './AxisGizmo';
import Settings from './Settings';
import HowToUseButton from './HowToUseButton';
import ResetCameraButton from './ResetCameraButton';
import Spinner from '@/components/Spinner';
import BraynsService, { BraynsServiceInterface } from '@/services/brayns';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { isString } from '@/util/type-guards';
import styles from './interactive-brayns.module.css';

interface InteractiveBraynsProps {
  className?: string;
  token: string;
}

export default function InteractiveBrayns() {
  const token = useAccessToken();
  return token ? <InteractiveBraynsWithToken token={token} /> : null;
}

function InteractiveBraynsWithToken({ className, token }: InteractiveBraynsProps) {
  const [howToUsePanelVisible, setHowToUsePanelVisible] = React.useState(false);
  const [overlayOpacity, setOverlayOpacity] = React.useState(1);
  const notification = useNotification();
  const circuitPath = BraynsService.useCurrentCircuitPath();
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const brayns = BraynsService.useBraynsService(token);
  const { handleOverlayCanvasMount } = BraynsService.useOverlay(token);
  const allocationProgress = BraynsService.State.progress.allocation.useValue();
  const handleSceneCanvasMount = useCanvasMountHandler(brayns);
  const busyMesh = BraynsService.State.progress.loadingMeshes.useValue();
  const busyMorpho = BraynsService.State.progress.loadingMorphologies.useValue();
  React.useEffect(() => {
    if (!isBraynsService(brayns)) return;

    const action = async () => {
      if (!circuitPath || !selectedBrainRegion) return;

      brayns.showRegion(circuitPath, { id: selectedBrainRegion.id });
    };
    action();
  }, [selectedBrainRegion, circuitPath, brayns]);
  const handleDisplayLogs = () => {
    if (!brayns || typeof brayns === 'string') return;

    notification.info('The stdout and stderr will be logged in the console.');
    brayns.downloadLogs();
  };
  const handleExportQueries = () => {
    if (!brayns || typeof brayns === 'string') return;

    brayns.exportQueries();
  };
  return (
    <div className={`${className ?? styles.expand}`}>
      <canvas className={styles.expand} ref={handleSceneCanvasMount} />
      <canvas
        className={styles.overlay}
        ref={handleOverlayCanvasMount}
        style={{ opacity: 0.1 + 0.9 * overlayOpacity }}
      />
      <div className={styles.gizmoContainer}>
        <AxisGizmo className={styles.gizmo} camera={BraynsService.CameraTransform} />
        <HowToUseButton onClick={() => setHowToUsePanelVisible(!howToUsePanelVisible)} />
        <ResetCameraButton onClick={() => BraynsService.CameraTransform.reset()} />
      </div>
      <div className={styles.spinners}>
        {brayns === null && <Spinner>{allocationProgress}</Spinner>}
        {busyMesh > 0 && <Spinner>Loading mesh...</Spinner>}
        {busyMorpho && <Spinner>Loading morphologies...</Spinner>}
      </div>
      {isString(brayns) && (
        <div className="error">
          <h1>Allocation failed!</h1>
          <pre>{brayns}</pre>
        </div>
      )}
      <div className={styles.debugButtons}>
        <Button onClick={handleDisplayLogs}>Display Logs</Button>
        <Button onClick={handleExportQueries}>Export queries</Button>
      </div>
      <Settings
        opacity={overlayOpacity}
        onOpacityChange={setOverlayOpacity}
        visible={howToUsePanelVisible}
        onVisibleChange={setHowToUsePanelVisible}
      />
    </div>
  );
}

type AllocationResult = null | string | BraynsServiceInterface;

function isBraynsService(data: AllocationResult): data is BraynsServiceInterface {
  return data !== null && !isString(data);
}

/**
 * @returns A function to use in the `ref` attribute of a canvas.
 * As soon as the canvas is mounted, this function will be called
 * and brayns service will be initialized.
 */
function useCanvasMountHandler(brayns: AllocationResult) {
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null);
  React.useEffect(() => {
    if (!isBraynsService(brayns)) return;

    // eslint-disable-next-line no-param-reassign
    brayns.canvas = canvas;
  }, [brayns, canvas]);
  return setCanvas;
}

function useAccessToken(): string | undefined {
  const { data: session } = useSession();
  return session?.accessToken;
}
