import find from 'lodash/find';
import { useCallback, useMemo } from 'react';
import Select, { OptionsOrGroups, SingleValue } from 'react-select';

import './ModelSelect.css';
import { ModelChoice } from '@/components/build-section/cell-model-assignment/types';

interface ModelSelectProps {
  value: ModelChoice;
  onChange: (newModelChoice: ModelChoice) => void;
  options?: OptionsOrGroups<ModelChoice, any>;
  compact: boolean;
}

const defaultOptions: OptionsOrGroups<ModelChoice, any> = [
  { label: 'Canonical', value: 'canonical' },
  { label: 'Placeholder', value: 'placeholder' },
];

export default function ModelSelect({
  value,
  onChange,
  options: userOptions,
  compact,
}: ModelSelectProps) {
  const handleSelectChange = useCallback(
    (newValue: SingleValue<any>) => {
      onChange(newValue.value);
    },
    [onChange]
  );

  const options = useMemo(() => userOptions ?? defaultOptions, [userOptions]);

  const optionsValue = useMemo(() => find(options, { value }), [options, value]);

  return (
    <Select
      unstyled
      isSearchable={false}
      options={options}
      value={optionsValue}
      classNamePrefix={compact ? `compact-model-select` : 'model-select'}
      onChange={handleSelectChange}
    />
  );
}
