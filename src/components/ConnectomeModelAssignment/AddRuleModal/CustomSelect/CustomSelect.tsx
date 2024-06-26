import { useId } from 'react';
import { Select } from 'antd';
import {
  useFieldsOptionsProvider,
  useLabelsProvider,
} from '@/components/ConnectomeModelAssignment/hooks';
import { SynapticAssignmentRule } from '@/types/connectome-model-assignment';
import styles from './custom-select.module.css';

export interface CustomSelectProps {
  rule: SynapticAssignmentRule;
  onChange(rule: SynapticAssignmentRule): void;
  field: keyof SynapticAssignmentRule;
}

export default function CustomSelect({ field, rule, onChange }: CustomSelectProps) {
  const id = useId();
  const getLabel = useLabelsProvider();
  const optionsProvider = useFieldsOptionsProvider();
  const label = getLabel(field);

  const options = optionsProvider(field).map((value) => ({ value, label: getLabel(value) }));
  return (
    <div className={styles.customSelect}>
      <label htmlFor={id} style={{ textAlign: 'left' }} className="text-primary-7">
        {label}
      </label>
      <Select
        showSearch={options.length >= 4}
        id={id}
        value={rule[field]}
        style={{ minWidth: '120px' }}
        bordered={false}
        placeholder={`Search ${label}`}
        onChange={(value) => onChange({ ...rule, [field]: value })}
        options={optionsProvider(field).map((value) => ({ value, label: getLabel(value) }))}
      />
    </div>
  );
}
