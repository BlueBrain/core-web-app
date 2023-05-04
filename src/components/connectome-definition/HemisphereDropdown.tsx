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
};

export default function HemisphereDropdown({
  value,
  onChange = () => {},
}: HemisphereDropdownProps) {
  return (
    <div className="w-[250px] flex flex-col h-[60px] justify-between">
      <div>Hemisphere</div>
      <Select style={{ width: 200 }} value={value} options={selectOptions} onChange={onChange} />
    </div>
  );
}
