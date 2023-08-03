import * as Checkbox from '@radix-ui/react-checkbox';
import { format } from 'date-fns';
import { ReactNode, useMemo, useState, useCallback } from 'react';
import { ConfigProvider, Tag } from 'antd';
import { CloseOutlined, InfoCircleFilled } from '@ant-design/icons';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import sortBy from 'lodash/sortBy';
import { Filter, OptionsData } from './types';
import { CheckIcon } from '@/components/icons';
import { CheckListProps, FilterValues } from '@/types/explore-section/application';
import LISTING_CONFIG from '@/constants/explore-section/es-terms-render';
import Search from '@/components/Search';
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
  setFilterValues,
}: {
  children: (props: CheckListProps) => ReactNode;
  data: OptionsData;
  filter: Filter;
  values: string[];
  setFilterValues: React.Dispatch<React.SetStateAction<FilterValues>>;
}) {
  const options = useMemo(() => {
    const agg = data[filter.field];
    const buckets = agg?.buckets ?? agg?.excludeOwnFilter?.buckets;

    return buckets
      ? buckets?.map(({ key, doc_count: count }) => ({
          checked: values.includes(key as string),
          key: key as string,
          count,
        }))
      : undefined;
  }, [data, filter.field, values]);

  const handleCheckedChange = useCallback(
    (value: string) => {
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
    },
    [filter.field, setFilterValues, values]
  );

  const onClear = useCallback(() => {
    setFilterValues((prevState) => ({
      ...prevState,
      [filter.field]: [],
    }));
  }, [filter.field, setFilterValues]);

  const defaultRenderLength = 8;
  const [renderLength, setRenderLength] = useState<number>(defaultRenderLength);
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
        onClick={() => setRenderLength(renderLength + adjustedLoadMoreLength)}
      >
        {`Load ${adjustedLoadMoreLength} more ${fieldLabel} (${remainingLength} remaining)`}
      </button>
    );

  const tagRender = (tagProps: CustomTagProps) => {
    const { label, closable, onClose } = tagProps;

    return (
      <ConfigProvider
        theme={{
          token: {
            colorFillQuaternary: '#003A8C',
            colorPrimary: 'white',
            lineHeightSM: 3,
            paddingXXS: 10,
          },
        }}
      >
        <Tag
          className="font-bold"
          closable={closable}
          closeIcon={<CloseOutlined className="text-primary-3" />}
          onClose={onClose}
          style={{ margin: '0.125rem 0.125rem 0.125rem auto' }}
        >
          {label}
        </Tag>
      </ConfigProvider>
    );
  };

  const search = () => (
    <Search
      colorBgContainer="#002766"
      onClear={onClear}
      handleSelect={(value) => {
        handleCheckedChange(value as string);
      }}
      options={
        options?.map(({ key }) => ({
          label: key as string,
          value: key as string,
        })) ?? []
      }
      mode="tags"
      placeholder={`Search for ${LISTING_CONFIG[filter.field].vocabulary.plural}`}
      tagRender={tagRender}
      value={options?.reduce(
        (acc, { checked, key }) => (checked ? [...acc, key as string] : acc),
        [] as string[]
      )}
    />
  );

  // Sort the options array by the checked property using Lodash's sortBy function
  const sortedOptions = useMemo(() => sortBy(options, { checked: false }), [options]);

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
          defaultRenderLength, // Pass the defaultRenderLength as a prop
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
