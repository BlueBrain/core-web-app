import { Dispatch, SetStateAction, useMemo } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { format } from 'date-fns';
import { InfoCircleFilled } from '@ant-design/icons';
import { Filter, OptionsData } from './types';
import { CheckIcon } from '@/components/icons';
import { FilterValues } from '@/types/explore-section/application';
import CenteredMessage from '@/components/CenteredMessage';

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
  values,
  setFilterValues,
}: {
  data: OptionsData;
  filter: Filter;
  values: string[];
  setFilterValues: Dispatch<SetStateAction<FilterValues>>;
}) {
  const options = useMemo(() => {
    const agg = data[filter.field];
    const buckets = agg?.buckets ?? agg?.excludeOwnFilter?.buckets;
    return buckets
      ? buckets?.map(({ key, doc_count: count }) => ({
          checked: values.includes(key as string),
          key,
          count,
        }))
      : undefined;
  }, [data, filter.field, values]);

  const handleCheckedChange = (value: string) => {
    setFilterValues((prevState) => {
      let newValues = [...values];
      if (values.includes(value)) {
        newValues = values.filter((val) => val !== value);
      } else {
        newValues.push(value);
      }

      return {
        ...prevState,
        [filter.field]: newValues,
      };
    });
  };

  return (
    <ul className="divide-y divide-white/20 flex flex-col space-y-3">
      {options && options.length > 0 ? (
        options?.map(({ checked, count, key }) => (
          <CheckListOption
            checked={checked}
            count={count}
            key={key}
            handleCheckedChange={handleCheckedChange}
            id={key as string}
            filterField={filter.field}
          />
        ))
      ) : (
        <div className="text-neutral-1">
          <CenteredMessage
            icon={<InfoCircleFilled style={{ fontSize: '2rem' }} />}
            message="We could not find any data that matches your selected filters. Please modify your selection to narrow down and retrieve the relevant information"
          />
        </div>
      )}
    </ul>
  );
}
