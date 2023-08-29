import { Select } from 'antd';

import { HemisphereDirection } from '@/types/connectome';

export const DIRECTION_LABEL: Record<HemisphereDirection, string> = {
  LL: 'Left to left',
  LR: 'Left to right',
  RL: 'Right to left',
  RR: 'Right to right',
};

const selectOptions = Object.entries(DIRECTION_LABEL).map(([value, label]) => ({ label, value }));

type HemisphereDropdownProps = {
  value?: HemisphereDirection;
  onChange?: (value: HemisphereDirection) => void;
  disabled?: boolean;
};

export default function HemisphereDropdown({
  value,
  onChange = () => {},
  disabled,
}: HemisphereDropdownProps) {
  return (
    <Select
      style={{ width: '100%' }}
      value={value}
      options={selectOptions}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
