import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';

import {
  eModelEditModeAtom,
  eModelUIConfigAtom,
  selectedEModelAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import { DefaultEModelType, EModelMenuItem } from '@/types/e-model';
import BuiltIcon from '@/components/icons/BuildValidated';
import ModifiedIcon from '@/components/icons/BuildModified';
import { DEFAULT_E_MODEL_STORAGE_KEY } from '@/constants/cell-model-assignment/e-model';
import { selectedBrainRegionAtom } from '@/state/brain-regions';

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
  const [selectedEModel, setSelectedEModel] = useAtom(selectedEModelAtom);
  const [eModelUIConfig, setEModelUIConfig] = useAtom(eModelUIConfigAtom);
  const setEModelEditMode = useSetAtom(eModelEditModeAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);

  const handleClick = (eModel: EModelMenuItem, brainRegionId: string) => {
    const newSelectedEModel = {
      ...eModel,
      mType: mTypeName,
    };
    setSelectedEModel({ ...newSelectedEModel });
    setEModelUIConfig({});
    setEModelEditMode(false);

    const defaultDataToSave: DefaultEModelType = {
      value: { ...newSelectedEModel },
      brainRegionId,
    };
    window.localStorage.setItem(DEFAULT_E_MODEL_STORAGE_KEY, JSON.stringify(defaultDataToSave));
  };

  // update name on left panel when config changes without having to reload the whole optimizations again
  const displayName = useCallback(
    (eModel: EModelMenuItem) =>
      !eModelUIConfig?.name ||
      !eModel.isOptimizationConfig ||
      !isEModelSelected(selectedEModel, eModel, mTypeName)
        ? eModel.name
        : eModelUIConfig.name,
    [selectedEModel, mTypeName, eModelUIConfig?.name]
  );

  if (!selectedBrainRegion) return null;

  return isExpanded ? (
    <div className="bg-none border-none m-0 w-full flex flex-col">
      <div className="font-bold self-start ml-2 text-white">{eType.name}</div>
      {availableEModels.map((eModel) => (
        <button
          key={eModel.id}
          type="button"
          onClick={() => handleClick(eModel, selectedBrainRegion.id)}
          className={`text-sm px-4 py-2 self-end ${
            isEModelSelected(selectedEModel, eModel, mTypeName)
              ? `bg-white text-primary-7`
              : `text-white`
          }`}
        >
          <span className="flex items-center gap-3">
            <span className="text-right">{displayName(eModel)}</span>
            <StatusIcon isOptimizationConfig={eModel.isOptimizationConfig} />
          </span>
        </button>
      ))}
    </div>
  ) : null;
}

const iconStyle = { width: 14, height: 14 };

function StatusIcon({ isOptimizationConfig }: { isOptimizationConfig: boolean }) {
  return (
    <div className="min-w-[20px]">
      {isOptimizationConfig ? <ModifiedIcon style={iconStyle} /> : <BuiltIcon style={iconStyle} />}
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
