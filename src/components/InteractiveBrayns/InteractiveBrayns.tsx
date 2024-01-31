'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import AxisGizmo from './AxisGizmo';
import Settings from './Settings';
import HowToUseButton from './HowToUseButton';
import ResetCameraButton from './ResetCameraButton';
import Spinner from '@/components/Spinner';
import BraynsService, { BraynsServiceInterface } from '@/services/brayns/circuit';
import { isString } from '@/util/type-guards';
import { useVisibleCells } from '@/state/atlas';
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
  const [howToUsePanelVisible, setHowToUsePanelVisible] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const circuitPath = BraynsService.useCurrentCircuitPath();
  const selectedBrainRegions = useVisibleCells();
  const brayns = BraynsService.useBraynsService(token);
  const { handleOverlayCanvasMount } = BraynsService.useOverlay(token);
  const allocationProgress = BraynsService.State.progress.allocation.useValue();
  const handleSceneCanvasMount = useCanvasMountHandler(brayns);
  const busyMesh = BraynsService.State.progress.loadingMeshes.useValue();
  const busyMorpho = BraynsService.State.progress.loadingMorphologies.useValue();
  useEffect(() => {
    if (!isBraynsService(brayns)) return;

    const action = async () => {
      if (!circuitPath) return;

      brayns.showCellsForRegions(circuitPath, selectedBrainRegions);
    };
    action();
  }, [selectedBrainRegions, circuitPath, brayns]);
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
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  useEffect(() => {
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
