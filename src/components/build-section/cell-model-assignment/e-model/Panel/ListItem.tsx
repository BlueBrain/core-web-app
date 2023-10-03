import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useState } from 'react';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

import {
  eModelEditModeAtom,
  eModelUIConfigAtom,
  selectedEModelAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import { EModelByETypeMappingType, EModelMenuItem } from '@/types/e-model';

interface ListItemProps {
  eTypeItems: EModelMenuItem[];
  mTypeName: string;
  eModelByETypeMapping: EModelByETypeMappingType | null;
}

export default function ListItem({ eTypeItems, mTypeName, eModelByETypeMapping }: ListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getAvailableEModels = (eTypeName: string) => {
    const availableEModels: EModelMenuItem[] = eModelByETypeMapping?.[eTypeName] || [];
    return availableEModels;
  };

  const handleExpand = useCallback(() => {
    setIsExpanded((oldValue) => !oldValue);
  }, []);

  return (
    <div className="ml-6">
      <MTypeLine name={mTypeName} onExpand={handleExpand} isExpanded={isExpanded} />
      {eTypeItems.map((eType) => (
        <ETypeLine
          key={eType.id}
          eType={eType}
          mTypeName={mTypeName}
          isExpanded={isExpanded}
          availableEModels={getAvailableEModels(eType.name)}
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

const isEModelSelected = (
  selectedEModel: EModelMenuItem | null,
  eModel: EModelMenuItem,
  currentMType: string
) => {
  if (!selectedEModel) return false;
  return selectedEModel.id === eModel.id && selectedEModel.mType === currentMType;
};

type ETypeLineProps = {
  eType: EModelMenuItem;
  mTypeName: string;
  isExpanded: boolean;
  availableEModels: EModelMenuItem[];
};

function ETypeLine({ eType, isExpanded, availableEModels, mTypeName }: ETypeLineProps) {
  const [selectedEModel, setSelectedEModel] = useAtom(selectedEModelAtom);
  const setEModelUIConfig = useSetAtom(eModelUIConfigAtom);
  const setEModelEditMode = useSetAtom(eModelEditModeAtom);

  const handleClick = (eModel: EModelMenuItem) => {
    setSelectedEModel({
      id: eModel.id,
      name: eModel.name,
      eType: eModel.eType,
      mType: mTypeName,
    });
    setEModelUIConfig({});
    setEModelEditMode(false);
  };

  return isExpanded ? (
    <div className="bg-none border-none m-0 w-full flex flex-col">
      <div className="font-bold self-start ml-2 text-white">{eType.name}</div>
      {availableEModels.map((eModel) => (
        <button
          key={eModel.id}
          type="button"
          onClick={() => handleClick(eModel)}
          className={`text-sm px-4 py-2 self-end ${
            isEModelSelected(selectedEModel, eModel, mTypeName)
              ? `bg-white text-primary-7`
              : `text-white`
          }`}
        >
          {eModel.name}
        </button>
      ))}
    </div>
  ) : null;
}
