import { useEffect, useRef, ReactNode } from 'react';
import { ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import {
  MultiBraynsManagerInterface,
  useMultiBraynsManager,
  useSlotError,
  useSlotState,
} from '../multi-brayns';
import { SlotState } from '../resource-manager/types';
import { SimulationReport } from '../resource-manager/backend-service';
import Spinner from '@/components/Spinner';
import { SimulationSlot } from '@/components/experiment-interactive/ExperimentInteractive/hooks';

import styles from './brayns-simulation-viewer.module.css';

export interface BraynsSimulationViewerProps {
  className?: string;
  slot: SimulationSlot;
  onReportLoaded(report: SimulationReport): void;
}

export default function BraynsSimulationViewer({
  className,
  slot,
  onReportLoaded,
}: BraynsSimulationViewerProps) {
  const manager = useMultiBraynsManager();
  useCircuitInitialization(slot, manager);
  useEffect(() => {
    if (!manager) return;

    manager.addSlotReportLoadedHandler(slot.slotId, onReportLoaded);
    // eslint-disable-next-line consistent-return
    return () => {
      manager.removeSlotReportLoadedHandler(slot.slotId, onReportLoaded);
    };
  }, [slot, manager, onReportLoaded]);
  const refCanvas = useCanvas(slot.slotId, manager);
  const progress = useProgress(slot.slotId);
  const [error, setError] = useSlotError(slot.slotId);
  return (
    <div className={getClassName(className)}>
      <canvas ref={refCanvas} />
      {progress && (
        <div className={styles.progress}>
          <div>{progress}</div>
          <Spinner />
        </div>
      )}
      {error && (
        <div className={styles.error}>
          <details>
            <summary>
              <b>An unexpected error occured...</b> (click for details)
            </summary>
            {error}
          </details>
          <center>
            <Button
              className="flex gap-2 items-center text-sm"
              icon={<ReloadOutlined />}
              type="primary"
              onClick={() => {
                setError(null);
                manager?.loadSimulation(slot, true);
              }}
            >
              Retry
            </Button>
          </center>
        </div>
      )}
    </div>
  );
}

function useCircuitInitialization(
  slot: SimulationSlot,
  manager: MultiBraynsManagerInterface | null
) {
  useEffect(() => {
    if (!manager) return;

    manager.loadSimulation(slot);
  }, [manager, slot]);
}

function getClassName(className?: string) {
  const classes = [styles.braynsSimulationViewer];
  if (className) classes.push(className);
  return classes.join(' ');
}

function useCanvas(slotId: number, manager: MultiBraynsManagerInterface | null) {
  const refSlot = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = refSlot.current;
    if (!canvas || !manager) return;

    manager.attachCanvas(slotId, canvas);
    // eslint-disable-next-line consistent-return
    return () => {
      manager.detachCanvas(slotId, canvas);
    };
  }, [manager, slotId]);
  return refSlot;
}

function useProgress(slotId: number): ReactNode | null {
  const state = useSlotState(slotId);
  switch (state) {
    case SlotState.Initializing:
      return <p>Initializing view...</p>;
    case SlotState.AllocatingResource:
      return <p>Allocating resource...</p>;
    case SlotState.StartingBrayns:
      return <p>Starting 3D renderer...</p>;
    case SlotState.LoadingSimulation:
      return <p>Loading simulation data...</p>;
    case SlotState.UnableToStart:
    case SlotState.UpAndRunning:
      // No progress. Now, the process is started or broken.
      return null;
    default:
      return <p>Unknown state: #{state}!</p>;
  }
}
