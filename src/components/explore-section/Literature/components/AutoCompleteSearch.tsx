'use client';

import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Suggestion } from '@/types/literature';

type Props = {
  onChange: (selectedValues: Suggestion[]) => void;
  fetchOptions: (searchTerm: string, signal?: AbortSignal) => Promise<Suggestion[]>;
  initialSuggestions?: Suggestion[];
  defaultValues?: Suggestion[];
  title: string;
};

export default function AutoCompleteSearch({
  title,
  onChange,
  fetchOptions,
  defaultValues,
  initialSuggestions,
}: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(initialSuggestions ?? []);
  const [fetching, setFetching] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string | null>();

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

      if (!value) {
        setFetching(false);
        return;
      }

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
    if (!searchTerm && initialSuggestions) {
      setSuggestions(initialSuggestions);
    }
  }, [searchTerm, initialSuggestions]);

  return (
    <Select
      onSearch={(value: string) => {
        debounceFetchOptions(value);
        setSearchTerm(value);
      }}
      placeholder={title}
      aria-label={title}
      mode="multiple"
      labelInValue
      filterOption={false}
      options={suggestions}
      allowClear={{
        clearIcon: <CloseOutlined className="text-primary-8 " />,
      }}
      onChange={onChange}
      suffixIcon={
        initialSuggestions?.length === 0 || fetching ? (
          <Spin size="small" data-testid="loading-suggestions" className="mr-9" />
        ) : (
          <DownOutlined className="text-primary-4" />
        )
      }
      defaultValue={defaultValues}
      className="min-w-[120px] rounded w-full"
      bordered={false}
      size="middle"
      popupMatchSelectWidth={false}
      notFoundContent={!fetching && <span>No suggestions found.</span>}
    />
  );
}
