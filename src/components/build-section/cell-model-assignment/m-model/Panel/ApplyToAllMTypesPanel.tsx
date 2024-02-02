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
  return <hr className="h-px w-full border-0 bg-primary-4" />;
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
    <div className="my-3 flex flex-col gap-5 px-7">
      <Separator />

      <div className="flex flex-row items-center justify-between gap-3 text-sm font-semibold text-white">
        <div className="pr-3">Apply to all M-types</div>
        <div className="flex-grow">
          <DefaultLoadingSuspense>
            <ModelSelect onChange={handleModelSelectChange} value={activeModel} />
          </DefaultLoadingSuspense>
        </div>
      </div>

      <div className="flex flex-row items-center justify-end gap-3">
        <button
          type="button"
          className={`bg-primary-1 p-1 px-6 font-semibold text-primary-7 ${
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
