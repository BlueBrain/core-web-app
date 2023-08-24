'use client';

import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import isInteger from 'lodash/isInteger';
import range from 'lodash/range';
import ceil from 'lodash/ceil';

import SimulationBox from './SimulationBox';
import { simulationPreviewsAtom } from '@/state/experiment-interactive';
import { classNames } from '@/util/utils';
import { MAX_SIMULATION_PREVIEW_COLS } from '@/components/experiment-interactive/config';

export default function SimulationGrid() {
  const simulationPreviews = useAtomValue(simulationPreviewsAtom);

  const gridBoxes = useMemo(
    () =>
      simulationPreviews.map((simulationPreview, index) => (
        <SimulationBox
          key={simulationPreview.id}
          index={index + 1}
          simulationPreview={simulationPreview}
        />
      )),
    [simulationPreviews]
  );

  const rowCount = useMemo(
    () => ceil(gridBoxes.length / MAX_SIMULATION_PREVIEW_COLS),
    [gridBoxes.length]
  );

  const colCount = useMemo(() => {
    const sqrt = Math.sqrt(gridBoxes.length);
    if (isInteger(sqrt)) {
      return sqrt;
    }

    if (gridBoxes.length < MAX_SIMULATION_PREVIEW_COLS) {
      return gridBoxes.length % MAX_SIMULATION_PREVIEW_COLS;
    }

    return MAX_SIMULATION_PREVIEW_COLS;
  }, [gridBoxes.length]);

  const hollowBoxes = useMemo(() => {
    const boxDiff = rowCount * colCount - gridBoxes.length;
    return range(boxDiff).map((i) => <div key={`hollow_${i}`} />);
  }, [colCount, gridBoxes.length, rowCount]);

  return (
    <div
      className={classNames(
        'w-full h-full grid divide-white/20 divide-x divide-y border-b border-b-white/20',
        `grid-rows-${rowCount}`,
        `grid-cols-${colCount}`
      )}
    >
      {gridBoxes}
      {hollowBoxes}
    </div>
  );
}
