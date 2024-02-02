import { useAtom, useSetAtom } from 'jotai';
import { OptionsOrGroups } from 'react-select';

import {
  selectedMModelNameAtom,
  selectedMModelIdAtom,
} from '@/state/brain-model-config/cell-model-assignment/m-model';
import ModelSelect from '@/components/build-section/cell-model-assignment/m-model/Panel/ModelSelect';
import { DefaultMModelType, ModelChoice } from '@/types/m-model';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import { DEFAULT_M_MODEL_STORAGE_KEY } from '@/constants/cell-model-assignment/m-model';
import { setInitializationValue } from '@/util/utils';

interface MTypeListItemProps {
  label: string;
  id: string;
  activeModel: ModelChoice;
  onModelChange: (mTypeId: string, newValue: ModelChoice) => void;
  onlyPlaceholder: boolean;
  brainRegionId: string;
}

export default function ListItem({
  label,
  id,
  activeModel,
  onModelChange,
  onlyPlaceholder,
  brainRegionId,
}: MTypeListItemProps) {
  const [selectedMModelName, setSelectedMModelName] = useAtom(selectedMModelNameAtom);
  const setSelectedMModelId = useSetAtom(selectedMModelIdAtom);

  const handleClick = () => {
    setSelectedMModelName(label);
    setSelectedMModelId(id);

    setInitializationValue(DEFAULT_M_MODEL_STORAGE_KEY, {
      value: { name: label, brainRegionId, id },
    } satisfies DefaultMModelType);
  };

  const isActive = label === selectedMModelName;

  const handleModelChange = (newModelChoice: ModelChoice) => {
    onModelChange(id, newModelChoice);
  };

  const options: OptionsOrGroups<ModelChoice, any> = [
    { label: 'Placeholder', value: 'placeholder' },
    { label: `Canonical ${label}`, value: `canonical_${label}` },
  ];

  return (
    <button onClick={handleClick} type="button" className="m-0 border-none bg-none p-0">
      <div
        className={`flex flex-row items-center justify-between px-7 py-2 ${
          isActive ? `ml-4 bg-white text-primary-7` : `text-primary-1`
        }`}
      >
        <div className="min-w-[130px] text-left font-bold">{label}</div>
        <div className="flex-grow text-xs font-light">
          {onlyPlaceholder && <div className="text-end">Placeholder</div>}
          {!onlyPlaceholder && (
            <DefaultLoadingSuspense>
              <ModelSelect
                value={activeModel}
                onChange={handleModelChange}
                options={options}
                compact
              />
            </DefaultLoadingSuspense>
          )}
        </div>
      </div>
    </button>
  );
}
