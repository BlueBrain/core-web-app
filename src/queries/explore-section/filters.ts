import esb, { Query } from 'elastic-builder';
import { format } from 'date-fns';
import { Filter, RangeFilter } from '@/components/Filter/types';
import { filterHasValue } from '@/components/Filter/util';
import { getFieldEsConfig } from '@/api/explore-section/fields';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/experiment-types';

function buildRangeQuery(filter: RangeFilter, esTerm: string) {
  const filterESBuilder = esb.rangeQuery(esTerm);
  if (filter.value.gte) {
    filterESBuilder.gte(filter.value.gte as number);
  }
  if (filter.value.lte) {
    filterESBuilder.lte(filter.value.lte as number);
  }
  return filterESBuilder;
}

export function getFilterESBuilder(filter: Filter): Query | undefined {
  const esConfig = getFieldEsConfig(filter.field);

  let filterESBuilder;

  switch (filter.type) {
    case 'checkList':
    case 'checkListInference':
      filterESBuilder = esb.termsQuery(esConfig?.flat?.filter, filter.value);

      break;
    case 'dateRange':
      filterESBuilder = esb.rangeQuery(esConfig?.flat?.filter);

      if (filter.value.gte) {
        filterESBuilder.gte(format(filter.value.gte, 'yyyy-MM-dd'));
      }

      if (filter.value.lte) {
        filterESBuilder.lte(format(filter.value.lte, 'yyyy-MM-dd'));
      }

      break;
    case 'valueRange':
      if (esConfig?.nested) {
        filterESBuilder = esb
          .nestedQuery()
          .path(esConfig.nested.nestField)
          .query(
            esb
              .boolQuery()
              .must(esb.termQuery(esConfig.nested.extendedField, esConfig.nested.field))
              .must(buildRangeQuery(filter, `${esConfig.nested.nestField}.value`))
          );
      } else {
        filterESBuilder = buildRangeQuery(filter, esConfig?.flat?.filter || '');
      }

      break;
    case 'valueOrRange':
      switch (typeof filter.value) {
        case 'number':
          filterESBuilder = esb.termsQuery(
            esConfig?.flat?.filter || `parameter.coords.${filter.field}`,
            filter.value
          );
          break;
        case 'object': // GteLteValue
          filterESBuilder = esb.rangeQuery(
            esConfig?.flat?.filter || `parameter.coords.${filter.field}`
          );

          if (filter.value?.gte) {
            filterESBuilder.gte(filter.value.gte as number);
          }

          if (filter.value?.lte) {
            filterESBuilder.lte(filter.value.lte as number);
          }

          break;
        default:
          filterESBuilder = undefined;
      }

      break;
    default:
      filterESBuilder = undefined;
  }

  return filterESBuilder;
}

export default function buildFilters(
  filters: Filter[],
  searchString?: string,
  descendantIds?: string[],
  experimentDataType?: string
) {
  const filtersQuery = new esb.BoolQuery();

  if (experimentDataType) {
    filtersQuery.must(esb.termQuery('@type.keyword', experimentDataType));
    if (EXPERIMENT_DATA_TYPES[experimentDataType].curated) {
      filtersQuery.must(esb.termQuery('curated', true));
    }
  }

  filtersQuery.must(esb.termQuery('deprecated', false));
  if (descendantIds && descendantIds.length > 0) {
    filtersQuery.must(esb.termsQuery('brainRegion.@id.keyword', descendantIds));
  }

  if (searchString) {
    filtersQuery.should([
      esb.multiMatchQuery(['*'], searchString).type('most_fields').operator('and').boost(10),
      esb.multiMatchQuery(['*.ngramtext'], searchString).type('most_fields').fuzziness('AUTO'),
    ]);
    filtersQuery.minimumShouldMatch(1);
  }
  filters.forEach((filter: Filter) => {
    const esBuilder = getFilterESBuilder(filter);

    if (esBuilder && (filterHasValue(filter) || filter.field === 'brainRegion')) {
      filtersQuery.must(esBuilder);
    }
  });
  return filtersQuery;
}
