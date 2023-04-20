/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-use-before-define */

'use client';

import { useAtomValue } from 'jotai';
import React from 'react';
import useNotification from '../../hooks/notifications';
import Button from './Button';
import convertStringColorIntoArrayColor from './convert-string-color-into-array-color';
import Spinner from '@/components/Spinner';
import BraynsService, { BraynsServiceInterface } from '@/services/brayns';
import { useCurrentCircuitPath } from '@/services/brayns/hooks/circuit';
import { useVisibleMeshes } from '@/state/atlas';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { isString } from '@/util/type-guards';
import styles from './interactive-brayns.module.css';

interface InteractiveBraynsProps {
  className?: string;
  token: string | undefined;
}

export default function InteractiveBrayns({ className, token }: InteractiveBraynsProps) {
  const notification = useNotification();
  const circuitPath = useCurrentCircuitPath();
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const visibleMeshes = useVisibleMeshes();
  const brayns = BraynsService.useBrayns(token);
  const allocationProgress = BraynsService.useAllocationProgress();
  const handleCanvasMount = useCanvasMountHandler(brayns);
  React.useEffect(() => {
    if (!isBraynsService(brayns)) return;

    const action = async () => {
      brayns.showMeshes(
        visibleMeshes.map((mesh) => ({
          type: 'mesh',
          url: mesh.contentURL,
          color: convertStringColorIntoArrayColor(mesh.color),
        }))
      );
    };
    action();
  }, [visibleMeshes, brayns]);
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
      <canvas className={styles.expand} ref={handleCanvasMount} />
      {brayns === null && (
        <div className={styles.expand}>
          <Spinner>{allocationProgress}</Spinner>
        </div>
      )}
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
