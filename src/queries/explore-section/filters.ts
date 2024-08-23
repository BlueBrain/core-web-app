import esb, { Query } from 'elastic-builder';
import { format } from 'date-fns';
import { Filter, ValueFilter } from '@/components/Filter/types';
import { filterHasValue } from '@/components/Filter/util';
import { getFieldEsConfig } from '@/api/explore-section/fields';
import { FilterTypeEnum } from '@/types/explore-section/filters';
import { DataType, DataTypeToNexusType } from '@/constants/explore-section/list-views';
import { DATA_TYPES_TO_CONFIGS } from '@/constants/explore-section/data-types';
import { StatusAttribute } from '@/types/explore-section/application';

function buildRangeQuery(filter: ValueFilter, esTerm: string) {
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
    case FilterTypeEnum.CheckList:
      if (esConfig?.nested) {
        filterESBuilder = esb
          .nestedQuery()
          .path(esConfig.nested.nestedPath)
          .query(
            esb
              .boolQuery()
              .must(esb.termQuery(esConfig.nested.filterTerm, esConfig.nested.filterValue))
              .must(esb.termsQuery(`${esConfig.nested.nestedPath}.@id.keyword`, filter.value))
          );
      } else {
        filterESBuilder = esb.termsQuery(esConfig?.flat?.filter, filter.value);
      }

      break;
    case FilterTypeEnum.DateRange:
      filterESBuilder = esb.rangeQuery(esConfig?.flat?.filter);

      if (filter.value.gte) {
        filterESBuilder.gte(format(filter.value.gte, 'yyyy-MM-dd'));
      }

      if (filter.value.lte) {
        filterESBuilder.lte(format(filter.value.lte, 'yyyy-MM-dd'));
      }

      break;
    case FilterTypeEnum.ValueRange:
      if (esConfig?.nested) {
        filterESBuilder = esb
          .nestedQuery()
          .path(esConfig.nested.nestedPath)
          .query(
            esb
              .boolQuery()
              .must(esb.termQuery(esConfig.nested.filterTerm, esConfig.nested.filterValue))
              .must(buildRangeQuery(filter, esConfig.nested.aggregationField))
          );
      } else {
        filterESBuilder = buildRangeQuery(filter, esConfig?.flat?.filter || '');
      }

      break;
    case FilterTypeEnum.ValueOrRange:
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
    case FilterTypeEnum.Text:
      if (filter.value) {
        filterESBuilder = esb
          .wildcardQuery(esConfig?.flat?.filter, filter.value)
          .caseInsensitive(true);
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
  dataType?: DataType,
  resourceIds?: string[],
  statusAttribute?: StatusAttribute
) {
  const filtersQuery = new esb.BoolQuery();
  console.log(statusAttribute);
  // Adding filters about the type of the resource
  if (dataType) {
    const dataConfig = DATA_TYPES_TO_CONFIGS[dataType];
    filtersQuery.must(esb.termQuery('@type.keyword', DataTypeToNexusType[dataType]));

    if (dataConfig.curated) filtersQuery.must(esb.termQuery('curated', true));
  }

  // Adding filters about the status of the resource, if any
  if (statusAttribute) {
    if (statusAttribute === StatusAttribute.AnalysisSuitable) {
      filtersQuery.must(esb.termQuery('analysisSuitable', true));
    }
    if (statusAttribute === StatusAttribute.SimulationReady) {
      filtersQuery.must(esb.termQuery('simulationReady', true));
    }
    if (statusAttribute === StatusAttribute.Validated) {
      filtersQuery.must(esb.termQuery('validated', true));
    }
  }

  // All resources need not to be deprecated
  filtersQuery.must(esb.termQuery('deprecated', false));

  // If there are descendants, adding them in the query
  if (descendantIds && descendantIds.length > 0) {
    filtersQuery.must(esb.termsQuery('brainRegion.@id.keyword', descendantIds));
  }

  if (resourceIds && resourceIds.length > 0) {
    filtersQuery.must(esb.termsQuery('@id.keyword', resourceIds));
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
