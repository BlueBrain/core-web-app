'use client';

import { useEffect, useState } from 'react';
import Drawer from 'antd/lib/drawer';
import { CloseOutlined } from '@ant-design/icons';
import isNil from 'lodash/isNil';
import { useAtomValue } from 'jotai';
import get from 'lodash/get';

import {
  GArticle,
  GenerativeQA,
  MLFilter,
  FilterFields,
  FilterFieldsType,
  FilterValues,
} from '@/types/literature';
import { Filter, GteLteValue } from '@/components/Filter/types';
import SearchFilter from '@/components/Filter/SearchFilter';
import { DateRange, FilterGroup } from '@/components/Filter';
import ReloadIcon from '@/components/icons/Reload';
import {
  literatureAtom,
  literatureResultAtom,
  useLiteratureAtom,
  useLiteratureFilter,
} from '@/state/literature';
import { normalizedDate } from '@/util/utils';
import { getFieldLabel } from '@/api/explore-section/fields';
import { Buckets } from '@/types/explore-section/fields';

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
        <CloseOutlined className="bg-primary-9 text-xs absolute left-[-30px] top-[0px] w-[40px] h-[30px] pl-3 rounded-tl-[22px] rounded-bl-[22px] text-white cursor-pointer" />
      }
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
      <FilterGroup
        filters={filters}
        setFilters={() => {}}
        items={filters.map((filter) => ({
          content: () => getFilterComponent(filter),
          label: getFieldLabel(filter.field),
          display: true,
        }))}
      />
      <div className="w-full flex justify-between">
        <button
          type="button"
          onClick={() => updateLiterature('filterValues', null)}
          className="flex justify-center items-center"
        >
          <span className="text-primary-2 mr-1">Clear filters</span>
          <ReloadIcon className="text-primary-2" />
        </button>

        <button
          type="submit"
          onClick={onApplyFilters}
          className="mt-4 float-right bg-primary-2 py-3 px-8 text-primary-9"
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

const getFilterBuckets = (
  articles: GArticle[],
  filterName: FilterFieldsType,
  filterFields: (keyof GArticle)[]
): Buckets => {
  const fieldValues = getPossibleOptions(articles, filterFields);

  return {
    buckets: Array.from(fieldValues).map(([value, frequency]) => ({
      doc_count: frequency,
      key: value,
      key_as_string: value,
    })),
    excludeOwnFilter: { buckets: [] },
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
