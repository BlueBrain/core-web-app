import { useAtom, useSetAtom } from 'jotai';

import { EModelMenuItem } from '@/types/e-model';
import { setDefaultEModelForMETypeAtom } from '@/state/brain-model-config/cell-model-assignment/me-model/setters';
import { selectedMENameAtom } from '@/state/brain-model-config/cell-model-assignment/me-model';

const isETypeSelected = (
  selectedMEName: [string, string] | [null, null],
  currentEType: string,
  currentMType: string
) => {
  if (!selectedMEName) return false;
  return selectedMEName[0] === currentMType && selectedMEName[1] === currentEType;
};

type ETypeEntryProps = {
  eType: EModelMenuItem;
  mTypeName: string;
  isExpanded: boolean;
  availableEModels: EModelMenuItem[];
};

export default function ETypeEntry({
  eType,
  isExpanded,
  availableEModels,
  mTypeName,
}: ETypeEntryProps) {
  const setDefaultEModelForMEType = useSetAtom(setDefaultEModelForMETypeAtom);
  const [selectedMEName, setSelectedMEName] = useAtom(selectedMENameAtom);

  const handleClick = () => {
    setSelectedMEName([mTypeName, eType.name]);
    setDefaultEModelForMEType();
  };

  return isExpanded ? (
    <div className="bg-none border-none m-0 w-full flex flex-col">
      <button
        type="button"
        onClick={handleClick}
        className={`flex justify-between px-4 py-2 items-center ${
          isETypeSelected(selectedMEName, eType.name, mTypeName)
            ? `bg-white text-primary-7`
            : `text-white`
        } ${availableEModels.length ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      >
        <div className="font-bold">{eType.name}</div>
        <div className="font-light text-xs">
          {availableEModels.length ? `${availableEModels.length} model(s)` : 'No e-model'}
        </div>
      </button>
    </div>
  ) : null;
}
