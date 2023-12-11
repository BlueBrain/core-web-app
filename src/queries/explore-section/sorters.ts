import esb, { Sort } from 'elastic-builder';
import { SortState } from '@/types/explore-section/application';
import { getFieldEsConfig } from '@/api/explore-section/fields';

function buildESSort({ field, order }: SortState): Sort | undefined {
  if (order === null) {
    return undefined;
  }
  const esConfig = getFieldEsConfig(field);

  if (!esConfig) {
    throw new Error(`Field ${field} does not have an ES config`);
  }

  if (!esConfig.nested) {
    return esb.sort(esConfig.flat?.sort).order(order).unmappedType('keyword');
  }

  return esb
    .sort(esConfig.nested.aggregationField)
    .order(order)
    .mode('min')
    .nested({
      path: esConfig.nested.nestedPath,
      filter: esb.termQuery(esConfig.nested.filterTerm, esConfig.nested.filterValue),
    });
}

export default buildESSort;
