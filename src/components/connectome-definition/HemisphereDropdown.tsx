import { Select } from 'antd';

import { hemisphereSelection } from '@/constants/connectome-definition';

const dropDownOptions = Object.entries(hemisphereSelection).map(([, value]) => ({
  value,
  label: value,
}));

export default function HemisphereDropdown() {
  return (
    <div className="w-[250px] flex flex-col h-[60px] justify-between">
      <div>Hemisphere</div>
      <Select
        defaultValue={hemisphereSelection.LEFT_RIGHT}
        style={{ width: 200 }}
        options={dropDownOptions}
      />
    </div>
  );
}
