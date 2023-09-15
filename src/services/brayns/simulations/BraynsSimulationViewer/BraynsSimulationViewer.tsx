import { useEffect, useRef, ReactNode } from 'react';

import {
  MultiBraynsManagerInterface,
  useMultiBraynsManager,
  useSlotError,
  useSlotState,
} from '../multi-brayns';
import { SlotState } from '../resource-manager/types';
import Spinner from '@/components/Spinner';

import styles from './brayns-simulation-viewer.module.css';

export interface BraynsSimulationViewerProps {
  className?: string;
  slotId: number;
}

export default function BraynsSimulationViewer({ className, slotId }: BraynsSimulationViewerProps) {
  const manager = useMultiBraynsManager();
  useCircuitInitialization(slotId, manager);
  const refCanvas = useCanvas(slotId, manager);
  const progress = useProgress(slotId);
  const error = useSlotError(slotId);
  return (
    <div className={getClassName(className)}>
      <canvas ref={refCanvas} />
      {progress && (
        <div className={styles.progress}>
          <Spinner />
          <div>{progress}</div>
        </div>
      )}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}

function useCircuitInitialization(slotId: number, manager: MultiBraynsManagerInterface | null) {
  useEffect(() => {
    if (!manager) return;

    manager.loadSimulation(slotId, {
      circuitPath:
        // '/gpfs/bbp.cscs.ch/project/proj3/cloned_circuits/FULL_BRAIN_WITH_SIM_15_06_2023/simulation_config.json',
        '/gpfs/bbp.cscs.ch/data/scratch/proj134/home/king/BBPP134-479_custom/full_shm800.b/simulation_config.json',
      populationName: 'root__neurons',
      report: { name: 'soma', type: 'compartment' },
    });
  }, [manager, slotId]);
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
