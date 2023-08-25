import { useAtomValue } from 'jotai/index';
import { simulationPreviewsAtom } from '@/state/experiment-interactive';
import { useMemo } from 'react';
import SimulationThumbnail from './SimulationThumbnail';
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
    <div className={`gap-2 grid grid-cols-${MAX_SIMULATION_PREVIEW_COLS}`}>{simulationBoxes}</div>
  );
}
