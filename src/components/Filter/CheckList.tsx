import { ReactNode, useMemo } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { format } from 'date-fns';
import { InfoCircleFilled } from '@ant-design/icons';
import sortBy from 'lodash/sortBy';
import { useAtom } from 'jotai';
import { Filter, OptionsData } from './types';
import SearchFilter from './SearchFilter';
import { DEFAULT_CHECKLIST_RENDER_LENGTH } from '@/constants/explore-section/list-views';
import { CheckIcon } from '@/components/icons';
import CenteredMessage from '@/components/CenteredMessage';
import LISTING_CONFIG from '@/constants/explore-section/es-terms-render';
import { CheckListProps } from '@/types/explore-section/application';
import { FiltersRenderLengthAtom } from '@/components/Filter/state';

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

export function CheckListOption({
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
  children,
  data,
  filter,
  values,
  onChange,
}: {
  children: (props: CheckListProps) => ReactNode;
  data: OptionsData;
  filter: Filter;
  values: string[];
  onChange: (value: string[]) => void;
}) {
  const options = useMemo(() => {
    const agg = data[filter.field];
    const buckets = agg?.buckets ?? agg?.excludeOwnFilter?.buckets;
    console.log("CHECKLIST COMPONENT buckets", buckets)

    return buckets
      ? buckets?.map(({ key, doc_count: count }) => ({
          checked: values.includes(key.label as string),
          key: key.label as string,
          count,
        }))
      : undefined;
  }, [data, filter.field, values]);

  const handleCheckedChange = (value: string) => {
    let newValues = [...values];
    if (values.includes(value)) {
      newValues = values.filter((val) => val !== value);
    } else {
      newValues.push(value);
    }
    onChange(newValues);
  };

  const [filtersRenderLength, setFiltersRenderLength] = useAtom(FiltersRenderLengthAtom);

  const renderLength = filtersRenderLength[filter.field];

  const updateRenderLength = () => {
    setFiltersRenderLength((prevFiltersRenderLength) => ({
      ...prevFiltersRenderLength,
      [filter.field]: renderLength + adjustedLoadMoreLength,
    }));
  };

  const loadMoreLength = 5;
  const remainingLength = (options?.length ?? 0) - renderLength;
  const adjustedLoadMoreLength =
    remainingLength >= loadMoreLength ? loadMoreLength : remainingLength;

  const fieldLabel =
    remainingLength === 1
      ? LISTING_CONFIG[filter.field].vocabulary.singular
      : LISTING_CONFIG[filter.field].vocabulary.plural;

  const loadMoreBtn = () =>
    !!remainingLength &&
    remainingLength > 0 && (
      <button
        className="bg-primary-8 ml-auto py-3 px-8 rounded text-white w-fit"
        type="button"
        onClick={() => updateRenderLength()}
      >
        {`Load ${adjustedLoadMoreLength} more ${fieldLabel} (${remainingLength} remaining)`}
      </button>
    );

  const search = () => (
    <SearchFilter data={data} filter={filter} values={values} onChange={onChange} />
  );

  // Sort the options array by the checked property using Lodash's sortBy function
  const sortedOptions = useMemo(() => sortBy(options, { checked: false }), [options]);

  console.log("CHECKLIST COMPONENT LOGGING OPTIONS + VALUES", options, values);
  return (
    <div className="flex flex-col gap-4">
      {sortedOptions && sortedOptions.length > 0 ? (
        children({
          options: sortedOptions,
          renderLength,
          handleCheckedChange,
          filterField: filter.field,
          search, // Pass the search function to the ListComponent
          loadMoreBtn, // Pass the loadMoreBtn function to the ListComponent
          defaultRenderLength: DEFAULT_CHECKLIST_RENDER_LENGTH, // Pass the defaultRenderLength as a prop
        })
      ) : (
        <div className="text-neutral-1">
          <CenteredMessage
            icon={<InfoCircleFilled style={{ fontSize: '2rem' }} />}
            message="We could not find any data that matches your selected filters. Please modify your selection to narrow down and retrieve the relevant information"
          />
        </div>
      )}
    </div>
  );
}

export const defaultList = ({
  options,
  renderLength,
  handleCheckedChange,
  filterField,
  search,
  loadMoreBtn,
  defaultRenderLength,
}: CheckListProps) => (
  <>
    {options && options.length > defaultRenderLength && search()}
    <ul className="divide-y divide-white/20 flex flex-col space-y-3">
      {options?.slice(0, renderLength)?.map(({ checked, count, key }) => (
        <CheckListOption
          checked={checked}
          count={count}
          key={key}
          handleCheckedChange={handleCheckedChange}
          id={key}
          filterField={filterField}
        />
      ))}
    </ul>
    {options && options.length > defaultRenderLength && loadMoreBtn()}
  </>
);
