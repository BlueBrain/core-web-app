import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/explore-fields-config';

export function getNestedField(field: string) {
  return field in EXPLORE_FIELDS_CONFIG ? EXPLORE_FIELDS_CONFIG[field] : { nestedField: null };
}

export function getFieldLabel(field: string) {
  return field in EXPLORE_FIELDS_CONFIG ? EXPLORE_FIELDS_CONFIG[field].title : field;
}

export function getFieldUnit(field: string) {
  return field in EXPLORE_FIELDS_CONFIG && EXPLORE_FIELDS_CONFIG[field].unit;
}
