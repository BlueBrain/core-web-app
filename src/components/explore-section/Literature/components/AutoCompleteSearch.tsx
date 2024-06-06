'use client';

import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import isNil from 'lodash/isNil';
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';

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
  const [suggestions, setSuggestions] = useReducer(
    (prev: Suggestion[], next: Suggestion[]) => next.sort((a, b) => a.label.localeCompare(b.label)),
    initialSuggestions?.sort((a, b) => a.label.localeCompare(b.label)) ?? []
  );
  const [openSuggestions, setOpenSuggestions] = useState(false);

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
      onFocus={() => {
        setSuggestions(initialSuggestions ?? []);
      }}
      maxTagTextLength={100} // Prevents overlap between delete tag icon and show autocomplete options icons when tag length is too long.
      open={openSuggestions}
      onDropdownVisibleChange={(open) => setOpenSuggestions(open)}
      placeholder={title}
      aria-label={title}
      mode="multiple"
      labelInValue
      filterOption={false}
      options={suggestions}
      allowClear={{
        clearIcon: <CloseOutlined className="text-primary-8" />,
      }}
      onChange={onChange}
      suffixIcon={
        isNil(initialSuggestions) || fetching ? (
          <Spin size="small" data-testid="loading-suggestions" className="absolute mx-2" />
        ) : (
          <DownOutlined
            className="absolute mx-2 text-primary-4"
            onClick={() => {
              setSearchTerm('');
              setOpenSuggestions(true);
            }}
          />
        )
      }
      defaultValue={defaultValues}
      className="min-w-[128px] rounded"
      variant="borderless"
      size="middle"
      popupMatchSelectWidth={false}
      notFoundContent={
        isNil(initialSuggestions) ? (
          <span>Searching...</span>
        ) : (
          !fetching && <span className="text-primary-3">No suggestions found.</span>
        )
      }
    />
  );
}
