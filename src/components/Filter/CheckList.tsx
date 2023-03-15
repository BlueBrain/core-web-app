import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckboxOption, Filter, OptionsData } from './types';
import { CheckIcon } from '@/components/icons';
import { getCheckedChangeHandler, getFillOptionsEffect } from '@/components/Filter/util';

function CheckListOption({
  checked,
  count,
  handleCheckedChange,
  id: key,
}: {
  checked: string | boolean;
  count: number | null;
  handleCheckedChange: (key: string) => void;
  id: string;
}) {
  return (
    <li className="flex items-center justify-between pt-3" key={key}>
      <span className="font-bold text-white">{key}</span>
      <span className="flex items-center justify-between gap-2">
        {!!count && <span className="text-primary-5">{`${count} datasets`}</span>}
        <Checkbox.Root
          className="bg-transparent border border-white h-[14px] rounded w-[14px]"
          checked={!!checked}
          onCheckedChange={() => handleCheckedChange(key)}
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
  formatter,
  options,
  setFilters,
  setOptions,
}: {
  data: OptionsData;
  field: string;
  filters: Filter[];
  formatter?: (bucket: CheckboxOption) => string;
  options: CheckboxOption[];
  setFilters: Dispatch<SetStateAction<Filter[]>>;
  setOptions: Dispatch<SetStateAction<CheckboxOption[]>>;
}) {
  const fillOptionsFromBuckets = useMemo(() => getFillOptionsEffect(field), [field]);

  // Populate the checkbox list from the aggregations
  useEffect(
    () => fillOptionsFromBuckets(data, filters, setOptions),
    [data, filters, setOptions, fillOptionsFromBuckets]
  );

  const handleCheckedChange = getCheckedChangeHandler(filters, setFilters, field);

  return (
    <ul className="divide-y divide-white/20 flex flex-col space-y-3">
      {options?.map(({ checked, count, key, keyAsString }) => (
        <CheckListOption
          checked={checked}
          count={count}
          handleCheckedChange={handleCheckedChange}
          id={formatter ? formatter({ checked, count, key, keyAsString }) : key}
          key={keyAsString ?? key}
        />
      ))}
    </ul>
  );
}
