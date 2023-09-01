import esb, { Sort } from 'elastic-builder';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/explore-fields-config';
import { SortState } from '@/types/explore-section/application';

function buildESSort({ field, order }: SortState): Sort | undefined {
  if (order === null) {
    return undefined;
  }

  const { nestedField } = EXPLORE_FIELDS_CONFIG[field];

  if (!nestedField) {
    return esb
      .sort(EXPLORE_FIELDS_CONFIG[field as keyof typeof EXPLORE_FIELDS_CONFIG].term as string)
      .order(order)
      .unmappedType('keyword');
  }

  return esb
    .sort(`${nestedField.nestField}.value`)
    .order(order)
    .mode('min')
    .nested({
      path: nestedField.nestField,
      filter: esb.termQuery(nestedField.extendedField, nestedField.field),
    });
}

export default buildESSort;
