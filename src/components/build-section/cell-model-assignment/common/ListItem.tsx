import { ElementType, useCallback, useState } from 'react';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

import { EModelByETypeMappingType, EModelMenuItem } from '@/types/e-model';

interface ListItemProps {
  eTypeItems: EModelMenuItem[];
  mTypeName: string;
  eModelByETypeMapping: EModelByETypeMappingType | null;
  eTypeEntryComponent: ElementType;
}

export default function ListItem({
  eTypeItems,
  mTypeName,
  eModelByETypeMapping,
  eTypeEntryComponent: ETypeEntryComponent,
}: ListItemProps) {
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
      <MTypeEntry name={mTypeName} onExpand={handleExpand} isExpanded={isExpanded} />
      {eTypeItems.map((eType) => (
        <ETypeEntryComponent
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

type MTypeEntryProps = {
  name: string;
  onExpand: () => void;
  isExpanded: boolean;
};

export function MTypeEntry({ name, onExpand, isExpanded }: MTypeEntryProps) {
  return (
    <div className="flex justify-between w-full py-2 text-primary-1">
      <div className="font-bold ">{name}</div>
      <button onClick={onExpand} type="button" className="bg-none border-none mr-6">
        {isExpanded ? <DownOutlined /> : <RightOutlined />}
      </button>
    </div>
  );
}
