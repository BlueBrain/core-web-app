import esb, { Query } from 'elastic-builder';
import { format } from 'date-fns';
import { Filter, RangeFilter } from '@/components/Filter/types';
import LISTING_CONFIG from '@/constants/explore-section/es-terms-render';
import { getESTerm } from '@/queries/explore-section/utils';
import { filterHasValue } from '@/components/Filter/util';

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
  const esTerm = getESTerm(filter.field);
  const { nestedField } = LISTING_CONFIG[filter.field];

  let filterESBuilder;

  switch (filter.type) {
    case 'checkList':
    case 'checkListInference':
      filterESBuilder = esb.termsQuery(esTerm, filter.value);

      break;
    case 'dateRange':
      filterESBuilder = esb.rangeQuery(esTerm);

      if (filter.value.gte) {
        filterESBuilder.gte(format(filter.value.gte, 'yyyy-MM-dd'));
      }

      if (filter.value.lte) {
        filterESBuilder.lte(format(filter.value.lte, 'yyyy-MM-dd'));
      }

      break;
    case 'valueRange':
      if (nestedField) {
        filterESBuilder = esb
          .nestedQuery()
          .path(nestedField.nestField)
          .query(
            esb
              .boolQuery()
              .must(esb.termQuery(nestedField.extendedField, nestedField.field))
              .must(buildRangeQuery(filter, `${nestedField.nestField}.value`))
          );
      } else {
        filterESBuilder = buildRangeQuery(filter, esTerm);
      }

      break;
    case 'valueOrRange':
      switch (typeof filter.value) {
        case 'number':
          filterESBuilder = esb.termsQuery(esTerm, filter.value);

          break;
        case 'object': // GteLteValue
          filterESBuilder = esb.rangeQuery(esTerm);

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

export default function buildFilters(type: string, filters: Filter[], searchString?: string) {
  const filtersQuery = new esb.BoolQuery();

  filtersQuery.must(esb.termQuery('@type.keyword', type));
  filtersQuery.must(esb.termQuery('deprecated', false));

  if (searchString) {
    filtersQuery.should([
      esb
        .multiMatchQuery(['*'], searchString)
        .type('most_fields')
        .fuzziness('AUTO')
        .operator('and')
        .boost(10),
      esb.multiMatchQuery(['*.ngramtext'], searchString).type('most_fields').fuzziness('AUTO'),
    ]);
    filtersQuery.minimumShouldMatch(1);
  }
  filters.forEach((filter: Filter) => {
    const esBuilder = getFilterESBuilder(filter);

    if (esBuilder && filterHasValue(filter)) {
      filtersQuery.must(esBuilder);
    }
  });
  return filtersQuery;
}
