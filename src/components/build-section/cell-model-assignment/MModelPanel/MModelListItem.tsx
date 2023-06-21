import { useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import { selectedMModelNameAtom } from '@/state/brain-model-config/cell-model-assignment';

interface MTypeListItemProps {
  name: string;
  annotation?: string;
}

export default function MModelListItem({ name, annotation }: MTypeListItemProps) {
  const [selectedMModelName, setSelectedMModelName] = useAtom(selectedMModelNameAtom);

  const handleClick = useCallback(() => {
    setSelectedMModelName(name);
  }, [name, setSelectedMModelName]);

  const isActive = useMemo(() => name === selectedMModelName, [name, selectedMModelName]);

  return (
    <button onClick={handleClick} type="button" className="bg-none border-none p-0 m-0">
      <div
        className={`flex flex-row justify-between items-center py-2 ${
          isActive ? `bg-white text-primary-7 py-1 pl-2 pr-3 ml-7` : `text-primary-1 px-7`
        }`}
      >
        <div className="font-bold">{name}</div>
        <div className="text-xs font-light">{annotation ?? ''}</div>
      </div>
    </button>
  );
}
