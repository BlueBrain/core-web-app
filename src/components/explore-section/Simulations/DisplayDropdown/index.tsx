import { Dispatch, SetStateAction } from 'react';
import { ConfigProvider, Select } from 'antd';
import selectorTheme from '@/components/explore-section/Simulations/DisplayDropdown/antd-theme';

type SimulationOptionsDropdownProps = {
  setSelectedValue: Dispatch<SetStateAction<string>>;
  selectedValue: string;
  options: { label: string; value: string }[];
};

export default function SimulationOptionsDropdown({
  setSelectedValue,
  selectedValue,
  options,
}: SimulationOptionsDropdownProps) {
  return (
    <ConfigProvider theme={selectorTheme}>
      <Select
        className="text-primary-7"
        style={{ width: 240 }}
        defaultValue={options.find((opt) => opt.value === selectedValue)?.value}
        onChange={setSelectedValue}
        options={options}
      />
    </ConfigProvider>
  );
}
