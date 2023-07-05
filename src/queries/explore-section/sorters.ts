import esb, { Sort } from 'elastic-builder';
import LISTING_CONFIG from '@/constants/explore-section/es-terms-render';

function buildESSort({ field, order }: { field: string; order: 'asc' | 'desc' }): Sort {
  const { nestedField } = LISTING_CONFIG[field];
  if (!nestedField) {
    return esb
      .sort(LISTING_CONFIG[field as keyof typeof LISTING_CONFIG].term as string)
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
