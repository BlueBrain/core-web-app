'use client';

import { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import Drawer from 'antd/lib/drawer';
import isNil from 'lodash/isNil';
import get from 'lodash/get';

import {
  GArticle,
  GenerativeQA,
  MLFilter,
  FilterFields,
  FilterFieldsType,
  FilterValues,
} from '@/types/literature';
import { Filter, GteLteValue, OptionsData } from '@/components/Filter/types';
import SearchFilter from '@/components/Filter/SearchFilter';
import LISTING_CONFIG from '@/constants/explore-section/es-terms-render';
import { DateRange, FilterGroup } from '@/components/Filter';
import ReloadIcon from '@/components/icons/Reload';
import {
  literatureAtom,
  literatureResultAtom,
  useLiteratureAtom,
  useLiteratureFilter,
} from '@/state/literature';

export default function FilterPanel() {
  const updateFilters = useLiteratureFilter();
  const updateLiterature = useLiteratureAtom();
  const { isFilterPanelOpen, selectedQuestionForFilter, filterValues } =
    useAtomValue(literatureAtom);
  const allQuestions = useAtomValue(literatureResultAtom);

  const [filters, setFilters] = useState<MLFilter[]>([]);

  useEffect(() => {
    const referencedArticles = getReferencedArticles(allQuestions, selectedQuestionForFilter);
    setFilters(mlFilters(referencedArticles, filterValues).filter((f) => f.hasOptions));
  }, [filterValues, allQuestions, selectedQuestionForFilter]);

  const onApplyFilters = () => {
    filters.forEach((filter) => {
      updateFilters(filter.field, filter.value);
    });
  };

  const getFilterComponent = (filter: MLFilter) => {
    const referencedArticles = getReferencedArticles(allQuestions, selectedQuestionForFilter);

    switch (filter.type) {
      case 'search':
        return (
          <SearchFilter
            data={getFilterBuckets(
              referencedArticles,
              filter.field,
              filter.field === 'journal' ? ['doi', 'journal'] : [filter.field]
            )}
            filter={filter}
            values={filter.value}
            onChange={(values: string[]) => {
              setFilters((prevFilters) => {
                const newFilters = prevFilters.map((f) =>
                  f.field === filter.field ? { ...f, value: values } : f
                ) as MLFilter[];
                return newFilters;
              });
            }}
          />
        );
      case 'dateRange':
        return (
          <DateRange
            filter={filter}
            onChange={(values: GteLteValue) => {
              setFilters((prevFilters) => {
                const newFilters = prevFilters.map((f) =>
                  f.field === filter.field ? { ...f, value: values } : f
                ) as MLFilter[];
                return newFilters;
              });
            }}
          />
        );
      default:
        throw new Error(`Unhandles filter type: ${filter.type}`);
    }
  };

  return (
    <Drawer
      open={isFilterPanelOpen}
      onClose={() => updateLiterature('isFilterPanelOpen', false)}
      mask={false}
      destroyOnClose
      maskClosable
      closeIcon={
        <CloseOutlined className="bg-primary-8 text-xs absolute left-[-30px] top-[0px] w-[40px] h-[30px] pl-3 rounded-tl-[22px] rounded-bl-[22px] text-white cursor-pointer" />
      }
      width="20vw"
      className="!bg-primary-8"
      bodyStyle={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#003A8C',
      }}
    >
      <FilterGroup
        filters={filters}
        setFilters={() => {}}
        items={filters.map((filter) => ({
          content: () => getFilterComponent(filter),
          label: LISTING_CONFIG[filter.field].title,
          display: true,
        }))}
      />
      <div className="flex justify-between w-full">
        <button
          type="button"
          onClick={() => updateLiterature('filterValues', null)}
          className="flex items-center justify-center"
        >
          <span className="mr-1 text-primary-2">Clear filters</span>
          <ReloadIcon className="text-primary-2" />
        </button>

        <button
          type="submit"
          onClick={onApplyFilters}
          className="float-right px-8 py-3 mt-4 bg-primary-2 text-primary-9"
        >
          Apply
        </button>
      </div>
    </Drawer>
  );
}

const getReferencedArticles = (
  allQuestions: GenerativeQA[],
  selectedQuestionForFilter: string | undefined
) =>
  get(
    allQuestions.find((q) => q.id === selectedQuestionForFilter),
    'articles',
    []
  );

export const FilterFns: Record<
  FilterFieldsType,
  (article: GArticle, values: Filter['value']) => boolean
> = {
  categories: (article: GArticle, selectedCategories: Filter['value']) =>
    (article?.categories ?? []).some((articleCategory) =>
      (selectedCategories as string[]).includes(articleCategory)
    ),
  articleType: (article: GArticle, selectedTypes: Filter['value']) =>
    (selectedTypes as string[]).length === 0
      ? true
      : (selectedTypes as string[]).includes(article.articleType ?? ''),
  journal: (article: GArticle, selectedJournals: Filter['value']) =>
    (selectedJournals as string[]).length === 0
      ? true
      : (selectedJournals as string[]).includes(article.journal ?? '') ||
        (selectedJournals as string[]).includes(article.doi ?? ''),
  authors: (article: GArticle, selectedAuthors: Filter['value']) =>
    (selectedAuthors as string[]).length === 0
      ? true
      : (article?.authors ?? []).some((author) => (selectedAuthors as string[]).includes(author)),
  publicationDate: (article: GArticle, range: Filter['value']) => {
    const selectedRange = range as GteLteValue;

    if (selectedRange.gte === null && selectedRange.lte === null) {
      return true;
    }
    if (isNil(article.publicationDate)) {
      return false;
    }

    const articleDateTimestamp = normalizedDate(article.publicationDate).getTime();

    if (selectedRange.gte && isNil(selectedRange.lte)) {
      return articleDateTimestamp >= normalizedDate(selectedRange.gte!).getTime();
    }
    if (selectedRange.lte && isNil(selectedRange.gte)) {
      return articleDateTimestamp <= normalizedDate(selectedRange.lte!).getTime();
    }

    return (
      articleDateTimestamp >= normalizedDate(selectedRange.gte!).getTime() &&
      articleDateTimestamp <= normalizedDate(selectedRange.lte!).getTime()
    );
  },
};

const mlFilters = (articles: GArticle[], filterValues: FilterValues | null): MLFilter[] =>
  FilterFields.map((filterField) => {
    const possibleOptions = Array.from(getPossibleOptions(articles, [filterField]));
    const noCurrentValue = isNil(filterValues) || isNil(filterValues[filterField]);

    switch (filterField) {
      case 'categories':
        return {
          field: filterField,
          type: 'search',
          aggregationType: null,
          hasOptions: possibleOptions.length > 0,
          value: noCurrentValue ? [] : (filterValues[filterField] as string[]),
        };
      case 'articleType':
        return {
          field: filterField,
          type: 'search',
          aggregationType: null,
          hasOptions: possibleOptions.length > 0,
          value: noCurrentValue ? [] : (filterValues[filterField] as string[]),
        };
      case 'journal':
        return {
          field: filterField,
          type: 'search',
          aggregationType: null,
          hasOptions: Array.from(getPossibleOptions(articles, ['journal', 'doi'])).length > 0,
          value: noCurrentValue ? [] : (filterValues[filterField] as string[]),
        };
      case 'authors':
        return {
          field: filterField,
          type: 'search',
          aggregationType: null,
          hasOptions: possibleOptions.length > 0,
          value: noCurrentValue ? [] : (filterValues[filterField] as string[]),
        };
      case 'publicationDate':
        return {
          field: filterField,
          type: 'dateRange',
          aggregationType: null,
          hasOptions: true,
          value: noCurrentValue
            ? { gte: null, lte: null }
            : (filterValues[filterField] as GteLteValue),
        };
      default:
        throw new Error(`Unhandled Filter Field: ${filterField}`);
    }
  });

const normalizedDate = (date: string | number | Date) =>
  date instanceof Date ? date : new Date(date);

const getFilterBuckets = (
  articles: GArticle[],
  filterName: FilterFieldsType,
  filterFields: (keyof GArticle)[]
): OptionsData => {
  const fieldValues = getPossibleOptions(articles, filterFields);

  return {
    [filterName]: {
      buckets: Array.from(fieldValues).map(([value, frequency]) => ({
        doc_count: frequency,
        key: value,
        key_as_string: value,
      })),
      excludeOwnFilter: { buckets: [] },
    },
  };
};

/**
 * @returns All posible options for a particular filter field (to show in the autocomplete menu, for example), along with the frequency of occurence of each option in the given articles..
 *
 * It is possible to get a union of possible options based on multiple filter fields by passing those fields in the `filterByFields` array.
 * For example, the options shown in the "Journal" filter's autocomplete should contain both, the doi and journal name. In this case, `filterByFields` should be ['doi', 'journal'].
 */
const getPossibleOptions = (
  articles: GArticle[],
  filterByFields: (keyof GArticle)[]
): Map<string, number> => {
  const valueFrequency = new Map<string, number>();

  filterByFields.forEach((field) => {
    articles.forEach((article) => {
      const fieldValues = Array.isArray(article[field])
        ? [...(article[field] as any[])]
        : [article[field]];

      fieldValues
        .filter((value) => !isNil(value))
        .forEach((value) => {
          const currFrequency = valueFrequency.get(value);

          if (isNil(currFrequency)) {
            valueFrequency.set(value, 1);
          } else {
            valueFrequency.set(value, currFrequency + 1);
          }
        });
    });
  });

  return valueFrequency;
};
