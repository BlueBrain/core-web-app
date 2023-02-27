import Select, { DropdownIndicatorProps, components } from 'react-select';
import React, { useMemo } from 'react';
import './SelectDropdown.css';
import ChevronRightIcon from '@/components/icons/ChevronRightIcon';

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
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <components.DropdownIndicator {...props}>
      <ChevronRightIcon />
    </components.DropdownIndicator>
  );
}

export default function SelectDropdown({
  selectOptions,
  onChangeFunc,
  defaultOption,
}: SelectDropdownProps) {
  const isDisabled = useMemo(() => {
    let nonDisabled = 0;
    selectOptions.forEach((option) => {
      if (!option.isDisabled) {
        nonDisabled += 1;
      }
    });
    return nonDisabled < 2;
  }, [selectOptions]);
  return (
    <Select
      hideSelectedOptions
      // @ts-ignore
      onChange={(sel: SelectOption) => onChangeFunc(sel?.value)}
      isDisabled={isDisabled}
      unstyled
      components={{ DropdownIndicator }}
      defaultValue={defaultOption}
      options={selectOptions}
      className="text-white font-bold text-[10px] w-[84px] bg-primary-8 border-solid border border-primary-7 py-0 pr-0 pl-[4px]"
      classNamePrefix="select-dropdown"
    />
  );
}
