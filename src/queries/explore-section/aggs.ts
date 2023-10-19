import esb, { Aggregation } from 'elastic-builder';
import { Filter } from '@/components/Filter/types';
import { getFieldEsConfig } from '@/api/explore-section/fields';

export function getAggESBuilder(filter: Filter): Aggregation | undefined {
  const { aggregationType } = filter;
  const esConfig = getFieldEsConfig(filter.field);

  switch (aggregationType) {
    case 'buckets':
      return esb
        .termsAggregation(filter.field, `${esConfig?.flat?.aggregation}.@id.keyword`)
        .size(100)
        .agg(esb.termsAggregation('label', `${esConfig?.flat?.aggregation}.label.keyword`).size(1));
    case 'stats':
      if (esConfig?.nested) {
        return esb
          .nestedAggregation(filter.field, esConfig.nested.nestField)
          .agg(
            esb
              .filterAggregation(
                filter.field,
                esb.termQuery(esConfig.nested.extendedField, esConfig.nested.field)
              )
              .agg(
                esb.statsAggregation(esConfig.nested.field, `${esConfig.nested.nestField}.value`)
              )
          );
      }
      return esb.statsAggregation(filter.field, esConfig?.flat?.aggregation || filter.field);
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
