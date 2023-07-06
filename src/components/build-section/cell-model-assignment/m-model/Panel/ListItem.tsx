import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useMemo, useState } from 'react';
import { OptionsOrGroups } from 'react-select';

import {
  selectedMModelNameAtom,
  selectedMModelIdAtom,
} from '@/state/brain-model-config/cell-model-assignment';
import ModelSelect from '@/components/build-section/cell-model-assignment/m-model/Panel/ModelSelect';
import { ModelChoice } from '@/components/build-section/cell-model-assignment/types';

interface MTypeListItemProps {
  label: string;
  id: string;
}

export default function ListItem({ label, id }: MTypeListItemProps) {
  const [selectedMModelName, setSelectedMModelName] = useAtom(selectedMModelNameAtom);
  const setSelectedMModelId = useSetAtom(selectedMModelIdAtom);
  const [activeModel, setActiveModel] = useState<ModelChoice>(`canonical_${label}`);

  const handleClick = () => {
    setSelectedMModelName(label);
    setSelectedMModelId(id);
  };

  const isActive = useMemo(() => label === selectedMModelName, [label, selectedMModelName]);

  const handleModelChange = useCallback(
    (newModelChoice: ModelChoice) => {
      console.warn(`Not implemented: Model changed for ${label} to ${newModelChoice}`);
      setActiveModel(newModelChoice);
    },
    [label]
  );

  const options: OptionsOrGroups<ModelChoice, any> = [
    { label: `Canonical ${label}`, value: `canonical_${label}` },
    { label: 'Placeholder', value: 'placeholder' },
  ];

  return (
    <button onClick={handleClick} type="button" className="bg-none border-none p-0 m-0">
      <div
        className={`flex flex-row justify-between items-center py-2 ${
          isActive ? `bg-white text-primary-7 py-1 pl-2 pr-3 ml-7` : `text-primary-1 px-7`
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
