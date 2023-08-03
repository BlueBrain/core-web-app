import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

import { selectedEModelAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';
import { EModelMenuItem } from '@/types/e-model';
import { mockEModelAssignedMap } from '@/constants/cell-model-assignment/e-model';
import { generateMapKey } from '@/util/cell-model-assignment';

interface ETypeListItemProps {
  item: EModelMenuItem;
}

export default function ListItem({ item }: ETypeListItemProps) {
  const [selectedEModel, setSelectedEModel] = useAtom(selectedEModelAtom);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded((oldValue) => !oldValue);
  };

  const handleClick = () => {
    setSelectedEModel(item);
  };

  const eModelAssigned = mockEModelAssignedMap[generateMapKey(item.mType.label, item.label)] || '';

  const isActive =
    selectedEModel?.label === item.label && selectedEModel.mType.label === item.mType.label;

  useEffect(() => {
    if (!eModelAssigned) return;
    setIsExpanded(true);
  }, [eModelAssigned]);

  return (
    <div className="ml-6">
      <MTypeLine name={item.mType.label} onExpand={handleExpand} isExpanded={isExpanded} />
      <ETypeLine
        name={item.label}
        eModelAssigned={eModelAssigned}
        onClick={handleClick}
        isActive={isActive}
        isExpanded={isExpanded}
      />
    </div>
  );
}

type MTypeLineProps = {
  name: string;
  onExpand: () => void;
  isExpanded: boolean;
};

function MTypeLine({ name, onExpand, isExpanded }: MTypeLineProps) {
  return (
    <div className="flex justify-between w-full py-2 text-primary-1">
      <div className="font-bold ">{name}</div>
      <button onClick={onExpand} type="button" className="bg-none border-none mr-6">
        {isExpanded ? <DownOutlined /> : <RightOutlined />}
      </button>
    </div>
  );
}

type ETypeLineProps = {
  name: string;
  eModelAssigned: string;
  onClick: () => void;
  isActive: boolean;
  isExpanded: boolean;
};

function ETypeLine({ name, eModelAssigned, onClick, isActive, isExpanded }: ETypeLineProps) {
  return isExpanded ? (
    <button onClick={onClick} type="button" className="bg-none border-none m-0 w-full">
      <div
        className={`flex flex-row justify-between items-center ml-2 py-2 pl-2 ${
          isActive ? `bg-white text-primary-7` : `text-white`
        }`}
      >
        <div className="font-bold">{name}</div>
        <div className="text-sm pr-4">{eModelAssigned}</div>
      </div>
    </button>
  ) : null;
}
