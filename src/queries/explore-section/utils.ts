import LISTING_CONFIG from '@/constants/explore-section/es-terms-render';

export function getESTerm(field: string) {
  return LISTING_CONFIG[field]?.term as string;
}
