import find from 'lodash/find';
import { useCallback } from 'react';
import Select, { OptionsOrGroups, SingleValue } from 'react-select';
import './ModelSelect.css';
import { ModelChoice } from '@/components/build-section/cell-model-assignment/types';

interface ModelSelectProps {
  value: ModelChoice;
  onChange: (newModelChoice: ModelChoice) => void;
}

const options: OptionsOrGroups<ModelChoice, any> = [
  { label: 'Canonical', value: 'canonical' },
  { label: 'Placeholder', value: 'placeholder' },
];

export default function ModelSelect({ value, onChange }: ModelSelectProps) {
  const handleSelectChange = useCallback(
    (newValue: SingleValue<any>) => {
      onChange(newValue.value);
    },
    [onChange]
  );
  const optionsValue = find(options, { value });

  return (
    <Select
      unstyled
      isSearchable={false}
      options={options}
      value={optionsValue}
      classNamePrefix="model-select"
      onChange={handleSelectChange}
    />
  );
}
