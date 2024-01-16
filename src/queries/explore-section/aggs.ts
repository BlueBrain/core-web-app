import esb, { Aggregation } from 'elastic-builder';
import { Filter } from '@/components/Filter/types';
import { getFieldEsConfig } from '@/api/explore-section/fields';

export function getAggESBuilder(filter: Filter): Aggregation | undefined {
  const { aggregationType } = filter;
  const esConfig = getFieldEsConfig(filter.field);

  switch (aggregationType) {
    case 'buckets':
      if (esConfig?.nested) {
        return esb
          .nestedAggregation(filter.field, esConfig.nested.nestedPath)
          .agg(
            esb
              .filterAggregation(
                filter.field,
                esb.termQuery(esConfig.nested.filterTerm, esConfig.nested.filterValue)
              )
              .agg(
                esb
                  .termsAggregation(filter.field, `${esConfig.nested.nestedPath}.@id.keyword`)
                  .agg(
                    esb.termsAggregation(
                      esConfig.nested.aggregationName,
                      esConfig.nested.aggregationField
                    )
                  )
              )
          );
      }
      return esb
        .termsAggregation(filter.field, `${esConfig?.flat?.aggregation}.label.keyword`)
        .size(100);

    case 'stats':
      if (esConfig?.nested) {
        return esb
          .nestedAggregation(filter.field, esConfig.nested.nestedPath)
          .agg(
            esb
              .filterAggregation(
                filter.field,
                esb.termQuery(esConfig.nested.filterTerm, esConfig.nested.filterValue)
              )
              .agg(
                esb.statsAggregation(
                  esConfig.nested.aggregationName,
                  esConfig.nested.aggregationField
                )
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
