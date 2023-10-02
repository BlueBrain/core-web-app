import find from 'lodash/find';
import { useCallback, useMemo } from 'react';
import Select, { OptionsOrGroups, SingleValue } from 'react-select';

import './ModelSelect.css';
import { useAtomValue } from 'jotai';
import { ModelChoice } from '@/types/m-model';
import { isConfigEditableAtom } from '@/state/brain-model-config';

interface ModelSelectProps {
  value: ModelChoice;
  onChange: (newModelChoice: ModelChoice) => void;
  options?: OptionsOrGroups<ModelChoice, any>;
  compact?: boolean;
}

const defaultOptions: OptionsOrGroups<ModelChoice, any> = [
  { label: 'Placeholder', value: 'placeholder' },
  { label: 'Canonical', value: 'canonical' },
];

export default function ModelSelect({
  value,
  onChange,
  options: userOptions,
  compact = false,
}: ModelSelectProps) {
  const handleSelectChange = useCallback(
    (newValue: SingleValue<any>) => {
      onChange(newValue.value);
    },
    [onChange]
  );
  const isConfigEditable = useAtomValue(isConfigEditableAtom);

  const options = useMemo(() => userOptions ?? defaultOptions, [userOptions]);

  const optionsValue = useMemo(() => find(options, { value }), [options, value]);

  return (
    <span
      className={isConfigEditable ? '' : 'cursor-not-allowed'}
      title={isConfigEditable ? '' : 'To edit, clone this configuration'}
    >
      <Select
        unstyled
        isSearchable={false}
        options={options}
        value={optionsValue}
        classNamePrefix={compact ? 'compact-model-select' : 'model-select'}
        onChange={handleSelectChange}
        isDisabled={!isConfigEditable}
      />
    </span>
  );
}
