'use client';

import { useEffect, useState } from 'react';
import Drawer from 'antd/lib/drawer';
import { CloseOutlined } from '@ant-design/icons';
import isNil from 'lodash/isNil';
import { useAtomValue } from 'jotai';
import get from 'lodash/get';
import { ConfigProvider, DatePicker } from 'antd';
import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns'; // eslint-disable-line import/no-extraneous-dependencies
import { RangeValue } from 'rc-picker/lib/interface'; // eslint-disable-line import/no-extraneous-dependencies
import {
  FilterFields,
  FilterFieldsType,
  FilterValues,
  GArticle,
  GenerativeQA,
  MLFilter,
} from '@/types/literature';
import { Filter, GteLteValue } from '@/components/Filter/types';
import SearchFilter from '@/components/Filter/SearchFilter';
import { FilterGroup } from '@/components/Filter';
import ReloadIcon from '@/components/icons/Reload';
import {
  literatureAtom,
  literatureResultAtom,
  useLiteratureAtom,
  useLiteratureFilter,
} from '@/state/literature';
import { normalizedDate } from '@/util/utils';
import { getFieldLabel } from '@/api/explore-section/fields';
import { BucketAggregation } from '@/types/explore-section/es-aggs';
import { FilterTypeEnum } from '@/types/explore-section/filters';

const { RangePicker } = DatePicker.generatePicker<Date>(dateFnsGenerateConfig);

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
      case FilterTypeEnum.Search:
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
      case FilterTypeEnum.DateRange:
        return (
          <ConfigProvider
            theme={{
              token: {
                colorBgContainer: '#002766',
                colorText: '#40A9FF',
                colorTextQuaternary: '#40A9FF',
                colorTextPlaceholder: '#40A9FF',
                colorTextDescription: '#40A9FF',
              },
            }}
          >
            <RangePicker
              format="DD-MM-YYYY"
              className="font-sm rounded border border-primary-4 bg-primary-9 py-2"
              allowEmpty={[true, true]}
              value={[filter.value.gte as Date, filter.value.lte as Date]}
              onChange={(newValues: RangeValue<Date>) => {
                setFilters((prevFilters) => {
                  const newFilters = prevFilters.map((f) =>
                    f.field === filter.field
                      ? {
                          ...f,
                          value: { gte: newValues?.[0] ?? null, lte: newValues?.[1] ?? null },
                        }
                      : f
                  ) as MLFilter[];
                  return newFilters;
                });
              }}
            />
          </ConfigProvider>
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
        <CloseOutlined className="absolute left-[-30px] top-[0px] h-[30px] w-[40px] cursor-pointer rounded-bl-[22px] rounded-tl-[22px] bg-primary-9 pl-3 text-xs text-white" />
      }
      width="20vw"
      styles={{
        header: {
          background: '#002766',
        },
        body: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#002766',
        },
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
      <div className="flex w-full justify-between">
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
          className="float-right mt-4 bg-primary-2 px-8 py-3 text-primary-9"
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

const initialValues: FilterValues = {
  categories: [],
  articleType: [],
  journal: [],
  authors: [],
  publicationDate: { gte: null, lte: null },
};

export const getActiveFiltersCount = (filters: FilterValues | null) => {
  if (!filters) {
    return 0;
  }

  let activeFilters = 0;

  Object.entries(filters).forEach(([key, value]) => {
    const filterKey = key as FilterFieldsType;

    switch (filterKey) {
      case 'categories':
      case 'articleType':
      case 'journal':
      case 'authors':
        if ((value as string[]).length > (initialValues[filterKey] as string[]).length) {
          activeFilters += 1;
        }
        break;
      case 'publicationDate':
        if ((value as GteLteValue).gte !== null || (value as GteLteValue).lte !== null) {
          activeFilters += 1;
        }
        break;
      default:
        throw new Error(`Unhandled Filter Field: ${key}`);
    }
  });

  return activeFilters;
};

const mlFilters = (articles: GArticle[], filterValues: FilterValues | null): MLFilter[] =>
  FilterFields.map((filterField) => {
    const possibleOptions = Array.from(getPossibleOptions(articles, [filterField]));
    const noCurrentValue = isNil(filterValues) || isNil(filterValues[filterField]);
    switch (filterField) {
      case 'categories':
        return {
          field: filterField,
          type: FilterTypeEnum.Search,
          aggregationType: null,
          hasOptions: possibleOptions.length > 0,
          value: noCurrentValue
            ? [...(initialValues.categories as string[])]
            : (filterValues[filterField] as string[]),
        };
      case 'articleType':
        return {
          field: filterField,
          type: FilterTypeEnum.Search,
          aggregationType: null,
          hasOptions: possibleOptions.length > 0,
          value: noCurrentValue
            ? [...(initialValues.articleType as string[])]
            : (filterValues[filterField] as string[]),
        };
      case 'journal':
        return {
          field: filterField,
          type: FilterTypeEnum.Search,
          aggregationType: null,
          hasOptions: Array.from(getPossibleOptions(articles, ['journal', 'doi'])).length > 0,
          value: noCurrentValue
            ? [...(initialValues.journal as string[])]
            : (filterValues[filterField] as string[]),
        };
      case 'authors':
        return {
          field: filterField,
          type: FilterTypeEnum.Search,
          aggregationType: null,
          hasOptions: possibleOptions.length > 0,
          value: noCurrentValue
            ? [...(initialValues.authors as string[])]
            : (filterValues[filterField] as string[]),
        };
      case 'publicationDate':
        return {
          field: filterField,
          type: FilterTypeEnum.DateRange,
          aggregationType: null,
          hasOptions: true,
          value: noCurrentValue
            ? { ...(initialValues.publicationDate as GteLteValue) }
            : (filterValues[filterField] as GteLteValue),
        };
      default:
        throw new Error(`Unhandled Filter Field: ${filterField}`);
    }
  });

const getFilterBuckets = (
  articles: GArticle[],
  _filterName: FilterFieldsType,
  filterFields: (keyof GArticle)[]
): BucketAggregation => {
  const fieldValues = getPossibleOptions(articles, filterFields);

  return {
    buckets: Array.from(fieldValues).map(([value, frequency]) => ({
      doc_count: frequency,
      key: value,
      key_as_string: value,
      label: value,
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
