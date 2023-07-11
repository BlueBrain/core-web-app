/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';
import { Select } from 'antd';
import { SynapticAssignmentRule } from '@/types/connectome-model-assignment';
import { useLabelsProvider } from '@/components/ConnectomeModelAssignment/hooks';

interface EditableTextCellProps {
  editing: boolean;
  field: keyof SynapticAssignmentRule;
  rule: SynapticAssignmentRule | null;
  content: string | null;
  options: Array<{ value: string; label: string }>;
}

// eslint-disable-next-line react/function-component-definition
export default function EditableTextCell({
  editing,
  field,
  rule,
  content,
  options,
}: EditableTextCellProps) {
  const getLabel = useLabelsProvider();
  const [value, setValue] = useState('<INIT>');
  useEffect(() => {
    if (!rule) {
      setValue('<null>');
      return;
    }
    setValue(rule[field] ?? '');
  }, [rule, field]);
  if (!rule || !editing) return <div key={field}>{getLabel(content ?? '')}</div>;

  const changeEventHandler = (newValue: string) => {
    setValue(newValue);
    // eslint-disable-next-line no-param-reassign
    rule[field] = newValue;
  };
  return (
    <Select
      key={field}
      value={value}
      options={options}
      onChange={changeEventHandler}
      style={{ width: '100%' }}
    />
  );
}
