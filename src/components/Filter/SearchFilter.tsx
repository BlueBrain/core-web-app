import { CloseOutlined } from '@ant-design/icons';
import { ConfigProvider, Tag } from 'antd';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { Filter } from './types';
import { useOptions } from './hooks';
import Search from '@/components/Search';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/fields-config';
import { Buckets } from '@/types/explore-section/fields';

export default function SearchFilter({
  data,
  filter,
  values,
  onChange,
}: {
  data: Buckets;
  filter: Filter;
  values: string[];
  onChange: (newValues: string[]) => void;
}) {
  const buckets = data?.buckets ?? data?.excludeOwnFilter?.buckets;
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

  return (
    options &&
    options.length > 0 && (
      <Search
        colorBgContainer="#002766"
        onClear={() => onChange([])}
        handleSelect={handleCheckedChange}
        options={options.map(({ id, label }) => ({
          label,
          value: id,
        }))}
        mode="multiple"
        placeholder={`Search for ${EXPLORE_FIELDS_CONFIG[filter.field].vocabulary.plural}`}
        tagRender={tagRender}
        value={options.reduce(
          (acc: string[], { checked, id }) => (checked ? [...acc, id] : acc),
          []
        )}
      />
    )
  );
}
