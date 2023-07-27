import { useMemo } from 'react';
import { Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { FilterItemType } from '../types';
import { SynapticAssignmentRule } from '@/types/connectome-model-assignment';
import { useFieldsOptionsProvider } from '@/components/ConnectomeModelAssignment/hooks';

import Style from './filter-item.module.css';

export interface FilterItemProps {
  item: FilterItemType;
  onChange(item: FilterItemType): void;
  onDelete(): void;
}

export default function FilterItem({ item, onChange, onDelete }: FilterItemProps) {
  const options = useOptions(item.ruleField);
  return (
    <div className={Style.filterItem}>
      <Select
        options={OPTIONS}
        value={item.ruleField}
        onChange={(ruleField) => onChange({ ...item, ruleField })}
      />
      <Select
        showSearch={options.length >= 3}
        options={options}
        value={item.value}
        onChange={(value) => onChange({ ...item, value })}
      />
      <div className={Style.deleteIcon}>
        <DeleteOutlined onClick={onDelete} />
      </div>
    </div>
  );
}

function useOptions(ruleField: keyof SynapticAssignmentRule) {
  const getOptions = useFieldsOptionsProvider();
  return useMemo(() => {
    const options = ['', ...getOptions(ruleField).sort()];
    return options.map((label) => ({ label, value: label }));
  }, [getOptions, ruleField]);
}

const LABELS: SynapticAssignmentRule = {
  fromSClass: 'From SClass',
  fromHemisphere: 'From Hemisphere',
  fromRegion: 'From Region',
  fromMType: 'From M-Type',
  fromEType: 'From E-Type',
  toHemisphere: 'To Hemisphere',
  toRegion: 'To Region',
  toSClass: 'To SClass',
  toMType: 'To M-Type',
  toEType: 'To E-Type',
  synapticType: 'Synapse Type',
};

const KEYS = Object.keys(LABELS) as Array<keyof SynapticAssignmentRule>;

const OPTIONS = KEYS.map((key: keyof SynapticAssignmentRule) => ({
  label: LABELS[key],
  value: key,
}));
