/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-use-before-define */

'use client';

import React from 'react';
import convertStringColorIntoArrayColor from './convert-string-color-into-array-color';
import Spinner from '@/components/Spinner';
import { useAtlasVisualizationManager } from '@/state/atlas';
import { isString } from '@/util/type-guards';
import BraynsService, { BraynsServiceInterface } from '@/services/brayns';
import styles from './interactive-brayns.module.css';

export interface InteractiveBraynsProps {
  className?: string;
  token: string | undefined;
}

export default function InteractiveBrayns({ className, token }: InteractiveBraynsProps) {
  const atlas = useAtlasVisualizationManager();
  const brayns = BraynsService.useBrayns(token);
  const allocationProgress = BraynsService.useAllocationProgress();
  const handleCanvasMount = useCanvasMountHandler(brayns);
  React.useEffect(() => {
    if (!isBraynsService(brayns)) return;

    const action = async () => {
      brayns.showOnly(
        atlas.visibleMeshes.map((mesh) => ({
          type: 'mesh',
          url: mesh.contentURL,
          color: convertStringColorIntoArrayColor(mesh.color),
        }))
      );
    };
    action();
  }, [atlas.visibleMeshes, brayns]);

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
 * and brayns sercice will be initialized.
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
