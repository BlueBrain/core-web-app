import Select, { DropdownIndicatorProps, SingleValue, MultiValue, components } from 'react-select';

import ChevronRightIcon from '@/components/icons/ChevronRightIcon';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon';
import { BrainViewId } from '@/types/ontologies';

import './styles.css';

export type SelectOption = {
  value: BrainViewId;
  label: string;
  isDisabled?: boolean;
};

type SelectDropdownProps = {
  selectOptions: SelectOption[];
  defaultOption: SelectOption;
  onChangeFunc: (viewId?: BrainViewId) => void;
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
      onChange={(sel: SingleValue<SelectOption> | MultiValue<SelectOption>) =>
        onChangeFunc((sel as SingleValue<SelectOption>)?.value)
      }
      unstyled
      components={{ DropdownIndicator }}
      defaultValue={defaultOption}
      options={selectOptions}
      className="text-white text-left font-bold text-[10px] w-[84px] bg-white border-solid border border-primary-7 py-0 pr-0 pl-[4px]"
      classNamePrefix="select-dropdown"
    />
  );
}
