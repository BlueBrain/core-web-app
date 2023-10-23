import { useCallback, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import ModelSelect from '@/components/build-section/cell-model-assignment/m-model/Panel/ModelSelect';
import { ChangeModelAction, ModelChoice } from '@/types/m-model';
import { analysedMTypesAtom } from '@/state/build-composition';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { bulkApplyAllAtom } from '@/state/brain-model-config/cell-model-assignment/m-model/setters';
import { isConfigEditableAtom } from '@/state/brain-model-config';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';

function Separator() {
  return <hr className="bg-primary-4 h-px w-full border-0" />;
}

export default function ApplyToAllMTypesPanel() {
  const mModelItems = useAtomValue(analysedMTypesAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const isConfigEditable = useAtomValue(isConfigEditableAtom);

  const setBulkApplyAll = useSetAtom(bulkApplyAllAtom);
  const [activeModel, setActiveModel] = useState<ModelChoice>('placeholder');

  const handleModelSelectChange = useCallback((newModelChoice: ModelChoice) => {
    if (newModelChoice !== null) {
      setActiveModel(newModelChoice);
    }
  }, []);

  const applyActiveModelToAll = useCallback(() => {
    if (selectedBrainRegion) {
      const action: ChangeModelAction = activeModel === 'canonical' ? 'add' : 'remove';

      const mTypeIds = mModelItems.map((mModel) => mModel.id);
      setBulkApplyAll(selectedBrainRegion.id, mTypeIds, action);
    }
  }, [activeModel, mModelItems, selectedBrainRegion, setBulkApplyAll]);

  return (
    <div className="px-7 flex flex-col gap-5 my-3">
      <Separator />

      <div className="flex flex-row justify-between font-semibold items-center gap-3 text-white text-sm">
        <div className="pr-3">Apply to all M-types</div>
        <div className="flex-grow">
          <DefaultLoadingSuspense>
            <ModelSelect onChange={handleModelSelectChange} value={activeModel} />
          </DefaultLoadingSuspense>
        </div>
      </div>

      <div className="flex flex-row justify-end items-center gap-3">
        <button
          type="button"
          className={`bg-primary-1 text-primary-7 font-semibold p-1 px-6 ${
            isConfigEditable ? '' : 'cursor-not-allowed'
          }`}
          onClick={applyActiveModelToAll}
          disabled={!isConfigEditable}
        >
          Apply
        </button>
      </div>

      <Separator />
    </div>
  );
}
