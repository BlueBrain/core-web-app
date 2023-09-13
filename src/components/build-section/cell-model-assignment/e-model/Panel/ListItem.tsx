import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

import { selectedEModelAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';
import {
  EModel,
  EModelByETypeMappingType,
  EModelMenuItem,
  SelectedEModelType,
} from '@/types/e-model';

interface ListItemProps {
  eTypeItems: EModelMenuItem[];
  mTypeName: string;
  eModelByETypeMapping: EModelByETypeMappingType | null;
}

export default function ListItem({ eTypeItems, mTypeName, eModelByETypeMapping }: ListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getAvailableEModels = (eTypeName: string) => {
    const availableEModels: EModel[] = eModelByETypeMapping?.[eTypeName] || [];
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
          key={eType.uuid}
          eType={eType}
          isExpanded={isExpanded}
          availableEModels={getAvailableEModels(eType.label)}
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
  selectedEModel: SelectedEModelType | null,
  eModel: EModel,
  eType: EModelMenuItem
) => selectedEModel?.id === eModel['@id'] && selectedEModel.mTypeName === eType.mType.label;

type ETypeLineProps = {
  eType: EModelMenuItem;
  isExpanded: boolean;
  availableEModels: EModel[];
};

function ETypeLine({ eType, isExpanded, availableEModels }: ETypeLineProps) {
  const [selectedEModel, setSelectedEModel] = useAtom(selectedEModelAtom);

  const handleClick = (eModel: EModel, mTypeName: string) => {
    setSelectedEModel({
      id: eModel['@id'],
      name: eModel.name,
      mTypeName,
    });
  };

  return isExpanded ? (
    <div className="bg-none border-none m-0 w-full flex flex-col">
      <div className="font-bold self-start ml-2 text-white">{eType.label}</div>
      {availableEModels.map((eModel) => (
        <button
          key={eModel['@id']}
          type="button"
          onClick={() => handleClick(eModel, eType.mType.label)}
          className={`text-sm px-4 py-2 self-end ${
            isEModelSelected(selectedEModel, eModel, eType)
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
