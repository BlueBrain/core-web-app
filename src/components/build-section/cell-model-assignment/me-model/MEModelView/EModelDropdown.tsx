import { Select } from 'antd';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { SelectOption } from '@/types/common';
import {
  eModelByETypeMappingAtom,
  selectedEModelAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import { EModelMenuItem } from '@/types/e-model';
import { setMEConfigPayloadAtom } from '@/state/brain-model-config/cell-model-assignment/me-model/setters';

export default function EModelDropdown() {
  const eModels = useAtomValue(eModelByETypeMappingAtom);
  const [selectedEModel, setSelectedEModel] = useAtom(selectedEModelAtom);
  const setMEConfigPayload = useSetAtom(setMEConfigPayloadAtom);

  if (!selectedEModel || !eModels) return null;

  const availableEModels: EModelMenuItem[] = eModels[selectedEModel.eType] || [];

  const options: SelectOption[] = availableEModels.map((eModel) => ({
    label: eModel.name,
    value: eModel.id,
  }));

  const onSelect = (newId: string) => {
    const newName = options.find((option) => option.value === newId)?.label;
    if (!newName) return;

    setSelectedEModel({
      ...selectedEModel,
      id: newId,
      name: newName,
    });

    setMEConfigPayload();
  };

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <div className="flex gap-5">
      <div className="text-3xl font-bold text-primary-8">Available E-Models</div>
      <Select
        key={`${selectedEModel.mType}-${selectedEModel.eType}`}
        defaultValue={selectedEModel.id}
        options={options}
        filterOption={filterOption}
        showSearch
        placeholder="Select model"
        optionFilterProp="children"
        onChange={onSelect}
      />
    </div>
  );
}
