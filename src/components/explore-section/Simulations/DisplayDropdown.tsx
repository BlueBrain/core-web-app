import { Dispatch, SetStateAction } from 'react';
import { Select } from 'antd';

type DisplayDropdownProps = {
  setSelectedDisplay: Dispatch<SetStateAction<string>>;
  selectedDisplay: string;
};

export default function DisplayDropdown({
  setSelectedDisplay,
  selectedDisplay,
}: DisplayDropdownProps) {
  const options = [
    {
      label: 'Spike raster',
      value: 'raster',
    },
    {
      label: 'Job status',
      value: 'status',
    },
    {
      label: 'PSTH',
      value: 'psth',
    },
    {
      label: 'Voltage report',
      value: 'voltage',
    },
    {
      label: 'Local field potential',
      value: 'lfp',
    },
    {
      label: 'Imagery',
      value: 'imagery',
    },
  ];

  return (
    <Select
      className="text-primary-7"
      style={{ width: 240, color: 'blue' }}
      dropdownStyle={{ borderRadius: '1px' }}
      defaultValue={options.find((opt) => opt.value === selectedDisplay)?.value}
      onChange={setSelectedDisplay}
      options={options}
    />
  );
}
