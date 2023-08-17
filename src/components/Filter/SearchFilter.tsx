import { CloseOutlined } from '@ant-design/icons';
import { ConfigProvider, Tag } from 'antd';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { useMemo } from 'react';
import { BucketAggregations } from '@/types/explore-section/fields';
import { Filter } from './types';
import Search from '@/components/Search';
import LISTING_CONFIG from '@/constants/explore-section/es-terms-render';

export default function SearchFilter({
  data,
  filter,
  values,
  onChange,
}: {
  data: BucketAggregations;
  filter: Filter;
  values: string[];
  onChange: (newValues: string[]) => void;
}) {
  const options = useMemo(() => {
    const agg = data[filter.field];
    const buckets = agg?.buckets ?? agg?.excludeOwnFilter?.buckets;

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
      onClear={() => onChange([])}
      handleSelect={(value) => {
        handleCheckedChange(value as string);
      }}
      options={
        options
          ? options.map(({ key }) => ({
              label: key as string,
              value: key as string,
            }))
          : []
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

  return options && options.length > 0 ? search() : null;
}
