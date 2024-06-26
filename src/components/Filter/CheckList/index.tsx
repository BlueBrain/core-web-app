import { ReactNode } from 'react';
import { useAtom } from 'jotai';
import { InfoCircleFilled } from '@ant-design/icons';
import { useOptions } from '../hooks';
import { CheckListProps } from '@/types/explore-section/application';
import { BucketAggregation } from '@/types/explore-section/es-aggs';
import { Filter } from '@/components/Filter/types';
import { FiltersRenderLengthAtom } from '@/components/Filter/state';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/fields-config';
import SearchFilter from '@/components/Filter/SearchFilter';
import { DEFAULT_CHECKLIST_RENDER_LENGTH } from '@/constants/explore-section/list-views';
import CenteredMessage from '@/components/CenteredMessage';
import { CheckListOption } from '@/components/Filter/CheckList/Option';

export default function CheckList({
  children,
  data,
  filter,
  values,
  onChange,
}: {
  children: (props: CheckListProps) => ReactNode;
  data: BucketAggregation;
  filter: Filter;
  values: string[];
  onChange: (value: string[]) => void;
}) {
  const buckets = data.buckets ?? data?.excludeOwnFilter?.buckets;
  const options = useOptions(values, buckets);

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
      ? EXPLORE_FIELDS_CONFIG[filter.field].vocabulary.singular
      : EXPLORE_FIELDS_CONFIG[filter.field].vocabulary.plural;

  const loadMoreBtn = () =>
    !!remainingLength &&
    remainingLength > 0 && (
      <button
        className="ml-auto w-fit rounded bg-primary-9 px-8 py-3 text-white"
        type="button"
        onClick={() => updateRenderLength()}
      >
        {`Load ${adjustedLoadMoreLength} more ${fieldLabel} (${remainingLength} remaining)`}
      </button>
    );

  const search = () => (
    <div className="border-b border-white">
      <SearchFilter data={data} filter={filter} values={values} onChange={onChange} />
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {options && options.length > 0 ? (
        children({
          options,
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
    <ul className="flex flex-col space-y-3 divide-y divide-white/20">
      {options
        ?.slice(0, renderLength)
        ?.map(({ checked, count, id, label }) => (
          <CheckListOption
            checked={checked}
            count={count}
            key={id}
            handleCheckedChange={handleCheckedChange}
            id={id}
            filterField={filterField}
            label={label}
          />
        ))}
    </ul>
    {options && options.length > defaultRenderLength && loadMoreBtn()}
  </>
);
