'use client';

import { CloseOutlined } from '@ant-design/icons';
import { ConfigProvider, Drawer } from 'antd';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useEffect, useMemo, useReducer } from 'react';

import { unwrap } from 'jotai/utils';
import AutoCompleteSearch from '../AutoCompleteSearch';
import {
  articleListingFilterPanelOpen,
  initialAuthorSuggestionsAtom,
} from '@/state/explore-section/literature-filters';
import { DateRange } from '@/components/Filter';
import { Suggestion } from '@/types/literature';
import ReloadIcon from '@/components/icons/Reload';
import {
  ArticleListFilters as ArticleFilters,
  fetchAuthorSuggestions,
  getAuthorOptions,
} from '@/components/explore-section/Literature/api';

type Props = {
  values: ArticleFilters;
  onSubmit: (update: ArticleFilters) => void;
  onClearFilters: () => void;
};

export default function ArticleListFilters({ values, onSubmit, onClearFilters }: Props) {
  const [open, setOpen] = useAtom(articleListingFilterPanelOpen);
  const initialAuthorSuggestions = useAtomValue(
    useMemo(() => unwrap(initialAuthorSuggestionsAtom), [])
  );

  const [filters, updateFilters] = useReducer(
    (prev: ArticleFilters, next: Partial<ArticleFilters>) => ({
      ...prev,
      ...next,
    }),
    {
      ...values,
    }
  );
  const memoizedFetchAuthors = useCallback(
    (searchTerm: string, signal?: AbortSignal) =>
      fetchAuthorSuggestions(searchTerm, signal).then((authors) => getAuthorOptions(authors)),
    []
  );

  useEffect(() => {
    updateFilters({ ...values });
  }, [values, open]);

  return (
    <Drawer
      open={open}
      mask={false}
      onClose={() => {
        setOpen(false);
        updateFilters({ ...values });
      }}
      destroyOnClose
      maskClosable
      closeIcon={
        <CloseOutlined className="bg-primary-9 text-xs absolute left-[-30px] top-[0px] w-[40px] h-[30px] pl-3 rounded-tl-[22px] rounded-bl-[22px] text-white cursor-pointer" />
      }
      data-testid="article-list-filters"
      width="20vw"
      headerStyle={{
        background: '#002766',
      }}
      bodyStyle={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#002766',
      }}
    >
      <div className="w-full">
        <div>
          <h3 className="font-bold text-xl text-white mb-2">Publication Date</h3>
          <DateRange
            onChange={(e) => updateFilters({ publicationDate: e })}
            filter={{
              field: 'publicationDate',
              type: 'dateRange',
              aggregationType: 'buckets',
              value: {
                gte: filters.publicationDate?.gte ?? null,
                lte: filters.publicationDate?.lte ?? null,
              },
            }}
          />
        </div>

        <ConfigProvider
          theme={{
            token: {
              colorFillQuaternary: '#91D5FF',
              colorFillSecondary: '#91D5FF',
              colorTextPlaceholder: '#40A9FF',
              colorText: '#91D5FF',
              colorBgBase: '#0050B3',
            },
            components: {
              Select: {
                clearBg: '#E8F7FF',
                selectorBg: '#0050B3',
                multipleItemBg: '#0050B3',
                optionSelectedColor: '#002766',
              },
            },
          }}
        >
          <div data-testid="author-input">
            <h3 className="font-bold text-xl text-white mt-12">Authors</h3>
            <AutoCompleteSearch
              title="Authors"
              initialSuggestions={initialAuthorSuggestions}
              defaultValues={filters.authors.map((a) => ({ label: a, key: a, value: a }))}
              fetchOptions={memoizedFetchAuthors}
              onChange={(selectedValues: Suggestion[]) =>
                updateFilters({ authors: selectedValues.map((v) => v.value) })
              }
            />
            <hr className="my-4 border-primary-2" />
          </div>
        </ConfigProvider>
      </div>

      <div className="w-full flex justify-between">
        <button
          type="submit"
          onClick={onClearFilters}
          className="flex items-center mt-4 py-3 text-primary-2"
        >
          Clear Filters
          <ReloadIcon className="text-primary-2 ml-2" />
        </button>

        <button
          type="submit"
          onClick={() => {
            onSubmit(filters);
            setOpen(false);
          }}
          className="mt-4 bg-primary-2 py-3 px-8 text-primary-9"
        >
          Apply
        </button>
      </div>
    </Drawer>
  );
}
