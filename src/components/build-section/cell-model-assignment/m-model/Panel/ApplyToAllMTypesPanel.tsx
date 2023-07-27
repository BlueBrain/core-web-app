import { useCallback, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import ReloadIcon from '@/components/icons/Reload';
import ModelSelect from '@/components/build-section/cell-model-assignment/m-model/Panel/ModelSelect';
import { ChangeModelAction, ModelChoice } from '@/types/m-model';
import { analysedMTypesAtom } from '@/state/build-composition';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { setAccumulativeTopologicalSynthesisAtom } from '@/state/brain-model-config/cell-model-assignment/m-model/setters';
import { expandBrainRegionId } from '@/util/cell-model-assignment';

function Separator() {
  return <hr className="bg-primary-4 h-px w-full border-0" />;
}

export default function ApplyToAllMTypesPanel() {
  const mModelItems = useAtomValue(analysedMTypesAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);

  const setAccumulativeTopologicalSynthesis = useSetAtom(setAccumulativeTopologicalSynthesisAtom);
  const [activeModel, setActiveModel] = useState<ModelChoice>('placeholder');
  const handleModelSelectChange = useCallback((newModelChoice: ModelChoice) => {
    if (newModelChoice !== null) {
      setActiveModel(newModelChoice);
    }
  }, []);

  const applyActiveModelToAll = useCallback(() => {
    if (selectedBrainRegion) {
      const expandedBrainRegionId = expandBrainRegionId(selectedBrainRegion.id);
      const action: ChangeModelAction = activeModel === 'canonical' ? 'add' : 'remove';

      mModelItems.forEach((mModelItem) => {
        const selectedMTypeId = mModelItem.id;
        setTimeout(() =>
          setAccumulativeTopologicalSynthesis(expandedBrainRegionId, selectedMTypeId, action)
        );
      });
    }
  }, [activeModel, mModelItems, selectedBrainRegion, setAccumulativeTopologicalSynthesis]);

  const resetToDefault = useCallback(() => {
    // eslint-disable-next-line no-console
    console.warn('Not implemented: Reset to default');
  }, []);

  return (
    <div className="px-7 flex flex-col gap-5 my-3">
      <Separator />

      <div className="flex flex-row justify-between font-semibold items-center gap-3 text-white text-sm">
        <div className="pr-3">Apply to all M-types</div>
        <div className="flex-grow">
          <ModelSelect onChange={handleModelSelectChange} value={activeModel} />
        </div>
      </div>

      <div className="flex flex-row justify-between items-center gap-3">
        <button
          type="button"
          className="bg-none text-primary-2 font-semibold flex flex-row items-center gap-2"
          onClick={resetToDefault}
        >
          Reset to default
          <ReloadIcon className="text-primary-2" />
        </button>
        <button
          type="button"
          className="bg-primary-1 text-primary-7 font-semibold p-1 px-6"
          onClick={applyActiveModelToAll}
        >
          Apply
        </button>
      </div>

      <Separator />
    </div>
  );
}
