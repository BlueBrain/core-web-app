import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { format } from 'date-fns';
import { CheckboxOption, Filter, OptionsData } from './types';
import { CheckIcon } from '@/components/icons';
import { getCheckedChangeHandler, getFillOptionsEffect } from '@/components/Filter/util';

const DisplayLabel = (filterField: string, key: string): string | null => {
  switch (filterField) {
    case 'updatedAt':
      return format(new Date(Number(key)), 'dd.MM.yyyy');
    case 'createdBy':
      return key.substring(key.lastIndexOf('/') + 1);
    default:
      return key;
  }
};

function CheckListOption({
  checked,
  count,
  handleCheckedChange,
  id: key,
  filterField,
}: {
  checked: string | boolean;
  count: number | null;
  handleCheckedChange: (key: string) => void;
  id: string;
  filterField: string;
}) {
  return (
    <li className="flex items-center justify-between pt-3" key={key}>
      <span className="font-bold text-white">{DisplayLabel(filterField, key)}</span>
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
  filter,
  filters,
  options,
  setFilters,
  setOptions,
}: {
  data: OptionsData;
  filter: Filter;
  filters: Filter[];
  options: CheckboxOption[];
  setFilters: Dispatch<SetStateAction<Filter[]>>;
  setOptions: Dispatch<SetStateAction<CheckboxOption[]>>;
}) {
  const fillOptionsFromBuckets = useMemo(() => getFillOptionsEffect(filter.field), [filter]);

  // Populate the checkbox list from the aggregations
  useEffect(
    () => fillOptionsFromBuckets(data, filters, setOptions),
    [data, filters, setOptions, fillOptionsFromBuckets]
  );

  const handleCheckedChange = getCheckedChangeHandler(filters, setFilters, filter);

  return (
    <ul className="divide-y divide-white/20 flex flex-col space-y-3">
      {options?.map(({ checked, count, key }) => (
        <CheckListOption
          checked={checked}
          count={count}
          key={key}
          handleCheckedChange={handleCheckedChange}
          id={key}
          filterField={filter.field}
        />
      ))}
    </ul>
  );
}
