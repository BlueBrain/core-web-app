'use client';

import { ConfigProvider, Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { useMemo, useRef, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Suggestion } from '@/types/literature';

type Props = {
  onChange: (selectedValues: Suggestion[]) => void;
  fetchOptions: (searchTerm: string) => Promise<Suggestion[]>;
  title: string;
};

export default function AutoCompleteSearch({ onChange, fetchOptions, title }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);

  const fetchRef = useRef(0);

  const debounceFetchOptions = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current = +1;
      const fetchId = fetchRef.current;
      setSuggestions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          return;
        }

        setSuggestions(newOptions);
        setFetching(false);
      });
    };
    return debounce(loadOptions, 150);
  }, [fetchOptions]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: '#E8F7FF',
          colorFillQuaternary: '#91D5FF',
          colorFillSecondary: '#91D5FF',
          colorTextPlaceholder: '#40A9FF',
          colorPrimary: 'white',
        },
      }}
    >
      <Select
        onSearch={debounceFetchOptions}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        placeholder={title}
        aria-label={title}
        mode="multiple"
        labelInValue
        filterOption={false}
        options={suggestions}
        allowClear
        onChange={onChange}
        suffixIcon={<DownOutlined className="text-primary-4" />}
        className="min-w-[120px] rounded"
        bordered={false}
        size="middle"
        popupMatchSelectWidth={false}
      />
    </ConfigProvider>
  );
}
