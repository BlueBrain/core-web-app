import { Select, Input } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { FilterItemType } from '../types';
import { SynapticAssignementRule } from '@/components/SynapticAssignementRulesTable/types';
import Style from './filter-item.module.css';

export interface FilterItemProps {
  item: FilterItemType;
  onChange(item: FilterItemType): void;
  onDelete(): void;
}

export default function FilterItem({ item, onChange, onDelete }: FilterItemProps) {
  return (
    <div className={Style.filterItem}>
      <Select
        options={OPTIONS}
        value={item.ruleField}
        onChange={(ruleField) => onChange({ ...item, ruleField })}
        style={{ borderRadius: '.5em 0 0 .5em' }}
      />
      <Input
        value={item.value}
        onChange={(evt) => onChange({ ...item, value: evt.target.value })}
        style={{ borderRadius: '0 .5em .5em 0' }}
      />
      <div className={Style.deleteIcon}>
        <DeleteOutlined onClick={onDelete} />
      </div>
    </div>
  );
}

const LABELS: SynapticAssignementRule = {
  fromSClass: 'From SClass',
  fromHemisphere: 'From Hemisphere',
  fromRegion: 'From Region',
  fromMType: 'From MType',
  fromEType: 'From EType',
  toHemisphere: 'To Hemisphere',
  toRegion: 'To Region',
  toSClass: 'To SClass',
  toMType: 'To MType',
  toEType: 'To EType',
  synapticType: 'Synapse Type',
};

const KEYS = Object.keys(LABELS) as Array<keyof SynapticAssignementRule>;

const OPTIONS = KEYS.map((key: keyof SynapticAssignementRule) => ({
  label: LABELS[key],
  value: key,
}));
