'use client';

import { DownOutlined } from '@ant-design/icons';
import { ConfigProvider, Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import isNil from 'lodash/isNil';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Suggestion } from '@/types/literature';

type Props = {
  onChange: (selectedValues: Suggestion[]) => void;
  fetchOptions: (searchTerm: string, signal?: AbortSignal) => Promise<Suggestion[]>;
  title: string;
  selectedValues?: string[];
};

export default function AutoCompleteSearch({
  onChange,
  fetchOptions,
  title,
  selectedValues,
}: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);

  const previousFetchController = useRef<AbortController>();

  const cancelPreviousFetch = () => {
    if (previousFetchController.current) {
      previousFetchController.current.abort();
    }
    const controller = new AbortController();
    const { signal } = controller;
    previousFetchController.current = controller;
    return signal;
  };

  const debounceFetchOptions = useMemo(() => {
    const loadOptions = (value: string) => {
      const signal = cancelPreviousFetch();

      setFetching(true);

      fetchOptions(value, signal)
        .then((newOptions) => {
          setSuggestions(newOptions);
          setFetching(false);
        })
        .catch((e) => {
          if (e.name !== 'AbortError') {
            setSuggestions([]);
            setFetching(false);
          }
        });
    };

    return debounce(loadOptions, 100);
  }, [fetchOptions]);

  useEffect(() => {
    const signal = cancelPreviousFetch();
    fetchOptions('', signal)
      .then((initialSuggestions) => {
        setSuggestions(initialSuggestions);
      })
      .catch(() => {});

    return () => {
      cancelPreviousFetch();
    };
  }, [fetchOptions]);

  const values = selectedValues
    ? (selectedValues
        .map((value) => suggestions.find((suggestion) => suggestion.key === value))
        .filter((value) => !isNil(value)) as Suggestion[])
    : [];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: '#E8F7FF',
          colorFillQuaternary: '#91D5FF',
          colorFillSecondary: '#91D5FF',
          colorTextPlaceholder: '#40A9FF',
        },
      }}
    >
      <Select
        onSearch={debounceFetchOptions}
        placeholder={title}
        value={values}
        aria-label={title}
        mode="multiple"
        labelInValue
        filterOption={false}
        options={suggestions}
        allowClear
        onChange={onChange}
        suffixIcon={fetching ? <Spin size="small" /> : <DownOutlined className="text-primary-4" />}
        className="min-w-[120px] rounded"
        bordered={false}
        size="middle"
        popupMatchSelectWidth={false}
      />
    </ConfigProvider>
  );
}
