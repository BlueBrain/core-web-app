import { Select } from 'antd';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { SelectOption } from '@/types/common';
import { eModelByETypeMappingAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';
import { EModelMenuItem } from '@/types/e-model';
import {
  setMEConfigPayloadAtom,
  unassignFromMEConfigPayloadAtom,
} from '@/state/brain-model-config/cell-model-assignment/me-model/setters';
import { selectedEModelAtom } from '@/state/brain-model-config/cell-model-assignment/me-model';

export default function EModelDropdown() {
  const eModels = useAtomValue(eModelByETypeMappingAtom);
  const [selectedEModel, setSelectedEModel] = useAtom(selectedEModelAtom);
  const setMEConfigPayload = useSetAtom(setMEConfigPayloadAtom);
  const unassignFromPayload = useSetAtom(unassignFromMEConfigPayloadAtom);

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
        key={`${selectedEModel.id}`}
        defaultValue={selectedEModel.id}
        options={options}
        filterOption={filterOption}
        showSearch
        placeholder="Select model"
        optionFilterProp="children"
        onChange={onSelect}
        style={{ minWidth: 200 }}
      />
      <button type="button" onClick={() => unassignFromPayload()}>
        Reset to default
      </button>
    </div>
  );
}
