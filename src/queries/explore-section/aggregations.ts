import { CheckListFilter, Filter } from '@/components/Filter/types';
import { ES_TERMS } from '@/constants/explore-section';

export default function buildAggregations(filters: Filter[]) {
  const filtersObject: { [key: string]: any } = {};
  const termsObject: { [key: string]: any } = {};
  const aggregations: { [key: string]: any } = {};

  // Loop through each filter in the filters array
  filters.forEach((filter) => {
    const term = ES_TERMS[filter.field]?.term as string;

    // If term doesn't exist, skip this filter
    if (!term) return;

    // Create filter object if it has values
    const filterValues = (filter as CheckListFilter).value;
    if (filterValues.length) {
      filtersObject[filter.field] = {
        terms: { [term]: filterValues },
      };
    }

    // Terms for used for aggregations
    termsObject[filter.field] = {
      terms: {
        field: `${term}`,
        size: 100,
      },
    };

    // Final step of aggregation query
    const filterAggs = {
      filter: filtersObject[filter.field],
      aggs: {
        excludeOwnFilter: {
          ...termsObject[filter.field],
        },
      },
    };

    // Combine all aggregation queries for return to query execution
    aggregations[filter.field] = {
      ...((filter as CheckListFilter).value.length ? filterAggs : termsObject[filter.field]),
    };
  });

  return { aggregations, ...filtersObject };
}
