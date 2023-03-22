import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckboxOption, Filter, OptionsData } from './types';
import { CheckIcon } from '@/components/icons';
import { getCheckedChangeHandler, getFillOptionsEffect } from '@/components/Filter/util';

function CheckListOption({
  checked,
  count,
  handleCheckedChange,
  label,
  value,
}: {
  checked: string | boolean;
  count: number | null;
  handleCheckedChange: (key: string) => void;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-center justify-between pt-3">
      <span className="font-bold text-white">{label}</span>
      <span className="flex items-center justify-between gap-2">
        {!!count && <span className="text-primary-5">{`${count} datasets`}</span>}
        <Checkbox.Root
          className="bg-transparent border border-white h-[14px] rounded shrink-0 w-[14px]"
          checked={!!checked}
          onCheckedChange={() => handleCheckedChange(value)}
        >
          <Checkbox.Indicator className="flex items-center justify-center w-full">
            <CheckIcon className="check" fill="#fff" />
          </Checkbox.Indicator>
        </Checkbox.Root>
      </span>
    </li>
  );
}

export default function CheckList({
  data,
  field,
  filters,
  label,
  options,
  setFilters,
  setOptions,
  value,
}: {
  data: OptionsData;
  field: string;
  filters: Filter[];
  label?: (key: string) => string;
  options: CheckboxOption[];
  setFilters: Dispatch<SetStateAction<Filter[]>>;
  setOptions: Dispatch<SetStateAction<CheckboxOption[]>>;
  value?: (key: string) => string;
}) {
  useEffect(() => {
    // console.log('data', data);
    // console.log('options', options);
  });

  const fillOptionsFromBuckets = useMemo(() => getFillOptionsEffect(field, value), [field, value]);

  // Populate the checkbox list from the aggregations
  useEffect(
    () => fillOptionsFromBuckets(data, filters, setOptions),
    [data, filters, setOptions, fillOptionsFromBuckets]
  );

  const handleCheckedChange = getCheckedChangeHandler(filters, setFilters, field);

  return (
    <ul className="divide-y divide-white/20 flex flex-col space-y-3">
      {options?.map(({ checked, count, key }) => (
        <CheckListOption
          checked={checked}
          count={count}
          handleCheckedChange={handleCheckedChange}
          key={value ? value(key) : key}
          label={label ? label(key) : key}
          value={value ? value(key) : key}
        />
      ))}
    </ul>
  );
}
