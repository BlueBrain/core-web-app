import { useAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

import { selectedEModelAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';
import { EModelMenuItem } from '@/types/e-model';
import { mockEModelAssignedMap } from '@/constants/cell-model-assignment/e-model';
import { generateMapKey } from '@/util/cell-model-assignment';

interface ETypeListItemProps {
  eTypeItems: EModelMenuItem[];
  mTypeName: string;
}

export default function ListItem({ eTypeItems, mTypeName }: ETypeListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = useCallback((newVal?: boolean) => {
    setIsExpanded((oldValue) => newVal || !oldValue);
  }, []);

  return (
    <div className="ml-6">
      <MTypeLine name={mTypeName} onExpand={handleExpand} isExpanded={isExpanded} />
      {eTypeItems.map((eType) => (
        <ETypeLine
          key={eType.uuid}
          eType={eType}
          handleExpand={handleExpand}
          isExpanded={isExpanded}
        />
      ))}
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
  eType: EModelMenuItem;
  handleExpand: (val: boolean) => void;
  isExpanded: boolean;
};

function ETypeLine({ eType, handleExpand, isExpanded }: ETypeLineProps) {
  const [selectedEModel, setSelectedEModel] = useAtom(selectedEModelAtom);

  const handleClick = () => {
    setSelectedEModel(eType);
  };

  const eModelAssigned =
    mockEModelAssignedMap[generateMapKey(eType.mType.label, eType.label)] || '';

  const isActive =
    selectedEModel?.label === eType.label && selectedEModel.mType.label === eType.mType.label;

  // programatically expand m-type list when e-type is assigned
  useEffect(() => {
    if (!eModelAssigned || isExpanded) return;

    handleExpand(true);
  }, [eModelAssigned, handleExpand, isExpanded]);

  return isExpanded ? (
    <button onClick={handleClick} type="button" className="bg-none border-none m-0 w-full">
      <div
        className={`flex flex-row justify-between items-center ml-2 py-2 pl-2 ${
          isActive ? `bg-white text-primary-7` : `text-white`
        }`}
      >
        <div className="font-bold">{eType.label}</div>
        <div className="text-sm pr-4">{eModelAssigned}</div>
      </div>
    </button>
  ) : null;
}
