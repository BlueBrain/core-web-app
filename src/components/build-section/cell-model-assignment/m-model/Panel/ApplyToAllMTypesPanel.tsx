import { useCallback, useState } from 'react';

import ReloadIcon from '@/components/icons/Reload';
import ModelSelect from '@/components/build-section/cell-model-assignment/m-model/Panel/ModelSelect';
import { ModelChoice } from '@/types/m-model';

function Separator() {
  return <hr className="bg-primary-4 h-px w-full border-0" />;
}

export default function ApplyToAllMTypesPanel() {
  const [activeModel, setActiveModel] = useState<ModelChoice>('placeholder');
  const handleModelSelectChange = useCallback((newModelChoice: ModelChoice) => {
    if (newModelChoice !== null) {
      setActiveModel(newModelChoice);
    }
  }, []);

  const applyActiveModelToAll = useCallback(() => {
    console.warn(`Not implemented: Apply ${activeModel}`);
  }, [activeModel]);

  const resetToDefault = useCallback(() => {
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
