import esb, { Aggregation } from 'elastic-builder';
import { Filter } from '@/components/Filter/types';
import { getESTerm } from '@/queries/explore-section/utils';
import LISTING_CONFIG from '@/constants/explore-section/es-terms-render';

export function getAggESBuilder(filter: Filter): Aggregation | undefined {
  const { aggregationType } = filter;
  const esTerm = getESTerm(filter.field);
  const { nestedField } = LISTING_CONFIG[filter.field];
  const { idTerm } = LISTING_CONFIG[filter.field].elasticConfig;

  switch (aggregationType) {
    case 'buckets':
      if (idTerm) {
        return esb
          .compositeAggregation(filter.field)
          .sources(
            esb.CompositeAggregation.termsValuesSource('id', idTerm),
            esb.CompositeAggregation.termsValuesSource('label', esTerm)
          )
          .size(200);
      }
      return esb
        .compositeAggregation(filter.field)
        .sources(esb.CompositeAggregation.termsValuesSource('label', esTerm))
        .size(200);
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
