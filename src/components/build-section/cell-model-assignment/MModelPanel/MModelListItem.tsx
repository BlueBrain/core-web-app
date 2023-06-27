import { useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import { selectedMModelNameAtom } from '@/state/brain-model-config/cell-model-assignment';

interface MTypeListItemProps {
  label: string;
  annotation?: string;
}

export default function MModelListItem({ label, annotation }: MTypeListItemProps) {
  const [selectedMModelName, setSelectedMModelName] = useAtom(selectedMModelNameAtom);

  const handleClick = useCallback(() => {
    setSelectedMModelName(label);
  }, [label, setSelectedMModelName]);

  const isActive = useMemo(() => label === selectedMModelName, [label, selectedMModelName]);

  return (
    <button onClick={handleClick} type="button" className="bg-none border-none p-0 m-0">
      <div
        className={`flex flex-row justify-between items-center py-2 ${
          isActive ? `bg-white text-primary-7 py-1 pl-2 pr-3 ml-7` : `text-primary-1 px-7`
        }`}
      >
        <div className="font-bold">{label}</div>
        <div className="text-xs font-light">{annotation ?? ''}</div>
      </div>
    </button>
  );
}
