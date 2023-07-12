import { useAtom, useSetAtom } from 'jotai';
import { OptionsOrGroups } from 'react-select';

import {
  selectedMModelNameAtom,
  selectedMModelIdAtom,
} from '@/state/brain-model-config/cell-model-assignment';
import ModelSelect from '@/components/build-section/cell-model-assignment/m-model/Panel/ModelSelect';
import { ModelChoice } from '@/types/m-model';

interface MTypeListItemProps {
  label: string;
  id: string;
  activeModel: ModelChoice;
  onModelChange: (mTypeId: string, newValue: ModelChoice) => void;
}

export default function ListItem({ label, id, activeModel, onModelChange }: MTypeListItemProps) {
  const [selectedMModelName, setSelectedMModelName] = useAtom(selectedMModelNameAtom);

  const setSelectedMModelId = useSetAtom(selectedMModelIdAtom);

  const handleClick = () => {
    setSelectedMModelName(label);
    setSelectedMModelId(id);
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
          <ModelSelect value={activeModel} onChange={handleModelChange} options={options} compact />
        </div>
      </div>
    </button>
  );
}
