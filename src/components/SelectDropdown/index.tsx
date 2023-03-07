import Select, { DropdownIndicatorProps, components } from 'react-select';
import React from 'react';
import './SelectDropdown.css';
import ChevronRightIcon from '@/components/icons/ChevronRightIcon';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon';

type SelectOption = {
  value: string;
  label: string;
  isDisabled: boolean;
};

type SelectDropdownProps = {
  selectOptions: SelectOption[];
  defaultOption: SelectOption;
  onChangeFunc: (viewId: string) => void;
};

function DropdownIndicator(props: DropdownIndicatorProps<SelectOption>) {
  const { selectProps } = props;
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <components.DropdownIndicator {...props}>
      {selectProps.menuIsOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
    </components.DropdownIndicator>
  );
}

export default function SelectDropdown({
  selectOptions,
  onChangeFunc,
  defaultOption,
}: SelectDropdownProps) {
  return (
    <Select
      hideSelectedOptions
      // @ts-ignore
      onChange={(sel: SelectOption) => onChangeFunc(sel?.value)}
      unstyled
      components={{ DropdownIndicator }}
      defaultValue={defaultOption}
      options={selectOptions}
      className="text-white text-left font-bold text-[10px] w-[84px] bg-primary-8 border-solid border border-primary-7 py-0 pr-0 pl-[4px]"
      classNamePrefix="select-dropdown"
    />
  );
}
