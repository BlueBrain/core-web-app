import { useCallback, useMemo } from 'react';
import { useSetAtom } from 'jotai';

import { useSimulationPreview } from '../hooks';
import ParamFields from './ParamFields';
import { SimulationPreviewElement } from '@/components/experiment-interactive/types';
import Buttons from '@/components/experiment-interactive/ExperimentInteractive/MainPanel/SimulationGrid/SimulationBox/ParamsEditor/Buttons';
import Topic from '@/components/experiment-interactive/ExperimentInteractive/MainPanel/SimulationGrid/SimulationBox/ParamsEditor/Topic';
import { simulationPreviewsAtom } from '@/state/experiment-interactive';

export default function ParamsEditor() {
  const setSimulationPreviews = useSetAtom(simulationPreviewsAtom);

  const { index, simulationPreview } = useSimulationPreview();

  const isEditMode = useMemo(
    () => typeof simulationPreview.editParams !== 'undefined',
    [simulationPreview.editParams]
  );

  const handleParamsChange = useCallback(
    (paramKey: string, value: number) => {
      if (simulationPreview.editParams) {
        const newEditParams = {
          ...simulationPreview.editParams,
          [paramKey]: value,
        };
        const newSimulationPreview = { ...simulationPreview, editParams: newEditParams };

        setSimulationPreviews((prev: SimulationPreviewElement[]) => {
          const newPreviews = [...prev];
          newPreviews[index - 1] = newSimulationPreview;
          return newPreviews;
        });
      }
    },
    [index, setSimulationPreviews, simulationPreview]
  );

  if (!isEditMode) {
    return null;
  }

  return (
    <div className="absolute w-full h-full bg-black p-3 flex flex-col items-center justify-center">
      <div className="flex flex-col gap-5 w-full max-w-xl">
        <Topic />

        <ParamFields onChange={handleParamsChange} />

        <Buttons />
      </div>
    </div>
  );
}
