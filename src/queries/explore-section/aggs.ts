import esb, { Aggregation } from 'elastic-builder';
import { Filter } from '@/components/Filter/types';
import { getESTerm } from '@/queries/explore-section/utils';
import { getNestedField } from '@/api/explore-section/fields';

export function getAggESBuilder(filter: Filter): Aggregation | undefined {
  const { aggregationType } = filter;
  const esTerm = getESTerm(filter.field);
  const { nestedField } = getNestedField(filter.field);

  switch (aggregationType) {
    case 'buckets':
      return esb.termsAggregation(filter.field, esTerm).size(100);
    case 'stats':
      if (nestedField) {
        return esb
          .nestedAggregation(filter.field, nestedField.nestField)
          .agg(
            esb
              .filterAggregation(
                filter.field,
                esb.termQuery(nestedField.extendedField, nestedField.field)
              )
              .agg(esb.statsAggregation(nestedField.field, `${nestedField.nestField}.value`))
          );
      }
      return esb.statsAggregation(filter.field, esTerm);

    default:
      return undefined;
  }
}

export default function buildAggs(filters: Filter[]) {
  const aggsQuery = esb.requestBodySearch();
  filters.forEach((filter: Filter) => {
    const esBuilder = getAggESBuilder(filter);
    if (esBuilder) {
      aggsQuery.agg(esBuilder);
    }
  });
  return aggsQuery;
}
