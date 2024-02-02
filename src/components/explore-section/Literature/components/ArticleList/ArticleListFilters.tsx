'use client';

import { CloseOutlined } from '@ant-design/icons';
import { ConfigProvider, Drawer } from 'antd';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useEffect, useMemo, useReducer } from 'react';

import { unwrap } from 'jotai/utils';
import AutoCompleteSearch from '../AutoCompleteSearch';
import {
  articleListingFilterPanelOpenAtom,
  articleTypeSuggestionsAtom,
  initialAuthorSuggestionsAtom,
  initialJournalSuggestionsAtom,
} from '@/state/explore-section/literature-filters';
import { DateRange } from '@/components/Filter';
import { Suggestion } from '@/types/literature';
import ReloadIcon from '@/components/icons/Reload';
import {
  ArticleListFilters as ArticleFilters,
  fetchAuthorSuggestions,
  fetchJournalSuggestions,
  getJournalOptions,
  getAuthorOptions,
  getArticleTypeOptions,
} from '@/components/explore-section/Literature/api';
import { normalizeString } from '@/util/utils';
import { FilterTypeEnum } from '@/types/explore-section/filters';

type Props = {
  values: ArticleFilters;
  onSubmit: (update: ArticleFilters) => void;
  onClearFilters: () => void;
};

export default function ArticleListFilters({ values, onSubmit, onClearFilters }: Props) {
  const [open, setOpen] = useAtom(articleListingFilterPanelOpenAtom);
  const initialAuthorSuggestions = useAtomValue(
    useMemo(() => unwrap(initialAuthorSuggestionsAtom), [])
  );
  const initialJournalSuggestions = useAtomValue(
    useMemo(() => unwrap(initialJournalSuggestionsAtom), [])
  );
  const articleTypesResponse = useAtomValue(useMemo(() => unwrap(articleTypeSuggestionsAtom), []));
  const articleTypes = articleTypesResponse ? getArticleTypeOptions(articleTypesResponse) : [];

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
  const memoizedFetchJournals = useCallback(
    (searchTerm: string, signal?: AbortSignal) =>
      fetchJournalSuggestions(searchTerm, signal).then((journal) => getJournalOptions(journal)),
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
        <CloseOutlined className="absolute left-[-30px] top-[0px] h-[30px] w-[40px] cursor-pointer rounded-bl-[22px] rounded-tl-[22px] bg-primary-9 pl-3 text-xs text-white" />
      }
      data-testid="article-list-filters"
      width="20vw"
      styles={{
        header: { background: '#002766' },
        body: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#002766',
        },
      }}
    >
      <div className="w-full">
        <div>
          <h3 className="mb-2 text-xl font-bold text-white">Publication Date</h3>
          <DateRange
            onChange={(e) => updateFilters({ publicationDate: e })}
            filter={{
              field: 'publicationDate',
              type: FilterTypeEnum.DateRange,
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
          <div data-testid="journal-input">
            <h3 className="mt-12 text-xl font-bold text-white">Journal</h3>
            <AutoCompleteSearch
              key="Journal"
              title="Journal"
              initialSuggestions={initialJournalSuggestions}
              defaultValues={filters.journals}
              fetchOptions={memoizedFetchJournals}
              onChange={(selectedValues: Suggestion[]) =>
                updateFilters({ journals: [...selectedValues] })
              }
            />
            <hr className="my-4 border-primary-2" />
          </div>

          <div data-testid="author-input">
            <h3 className="mt-12 text-xl font-bold text-white">Authors</h3>
            <AutoCompleteSearch
              key="Authors"
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

          <div data-testid="article-type-input">
            <h3 className="mt-12 text-xl font-bold text-white">Article type</h3>
            <AutoCompleteSearch
              key="ArticleType"
              title="Article type"
              initialSuggestions={articleTypes}
              defaultValues={filters.articleTypes.map((a) => ({ label: a, key: a, value: a }))}
              fetchOptions={async (searchTerm: string) =>
                (articleTypes ?? []).filter((articleTypeOption) =>
                  normalizeString(articleTypeOption.value).includes(normalizeString(searchTerm))
                )
              }
              onChange={(selectedValues: Suggestion[]) =>
                updateFilters({ articleTypes: selectedValues.map((v) => v.value) })
              }
            />
            <hr className="my-4 border-primary-2" />
          </div>
        </ConfigProvider>
      </div>

      <div className="flex w-full justify-between">
        <button
          type="submit"
          onClick={onClearFilters}
          className="mt-4 flex items-center py-3 text-primary-2"
        >
          Clear Filters
          <ReloadIcon className="ml-2 text-primary-2" />
        </button>

        <button
          type="submit"
          onClick={() => {
            onSubmit(filters);
            setOpen(false);
          }}
          className="mt-4 bg-primary-2 px-8 py-3 text-primary-9"
        >
          Apply
        </button>
      </div>
    </Drawer>
  );
}
