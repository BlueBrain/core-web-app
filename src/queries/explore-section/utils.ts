import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/explore-fields-config';

export function getESTerm(field: string) {
  return (EXPLORE_FIELDS_CONFIG[field]?.term as string) ?? `parameter.coords.${field}`;
}
