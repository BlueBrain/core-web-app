import { useMemo } from 'react';
import { useAtomValue } from 'jotai';

import SimulationThumbnail from './SimulationThumbnail';
import { simulationPreviewsAtom } from '@/state/experiment-interactive';
import { MAX_SIMULATION_PREVIEW_COLS } from '@/components/experiment-interactive/config';

export default function SelectSimulationsBox() {
  const simulationPreviews = useAtomValue(simulationPreviewsAtom);

  const simulationBoxes = useMemo(
    () =>
      simulationPreviews.map((simulationPreview, index) => (
        <SimulationThumbnail
          key={simulationPreview.id}
          index={index + 1}
          simulationPreview={simulationPreview}
        />
      )),
    [simulationPreviews]
  );

  return (
    <div className={`grid gap-2 grid-cols-${MAX_SIMULATION_PREVIEW_COLS}`}>{simulationBoxes}</div>
  );
}
