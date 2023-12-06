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

    const defaultDataToSave: DefaultMModelType = { value: { name: label, brainRegionId, id } };
    window.localStorage.setItem(DEFAULT_M_MODEL_STORAGE_KEY, JSON.stringify(defaultDataToSave));
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
    <button onClick={handleClick} type="button" className="bg-none border-none p-0 m-0">
      <div
        className={`flex flex-row justify-between items-center py-2 px-7 ${
          isActive ? `bg-white text-primary-7 ml-4` : `text-primary-1`
        }`}
      >
        <div className="font-bold min-w-[130px] text-left">{label}</div>
        <div className="text-xs font-light flex-grow">
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
