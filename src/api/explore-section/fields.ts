import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/explore-fields-config';

export function getFieldEsConfig(field: string) {
  return EXPLORE_FIELDS_CONFIG[field]?.esTerms;
}

export function getFieldLabel(field: string) {
  return field in EXPLORE_FIELDS_CONFIG ? EXPLORE_FIELDS_CONFIG[field].title : field;
}

export function getFieldUnit(field: string) {
  return field in EXPLORE_FIELDS_CONFIG && EXPLORE_FIELDS_CONFIG[field].unit;
}
