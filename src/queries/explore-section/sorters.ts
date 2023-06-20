import LISTING_CONFIG from '@/constants/explore-section/es-terms-render';

type ElasticsearchSort = Array<{ [field: string]: { order: 'asc' | 'desc' } }>;

function buildElasticsearchSort({
  field,
  order,
}: {
  field: string;
  order: 'asc' | 'desc';
}): ElasticsearchSort {
  return [{ [LISTING_CONFIG[field as keyof typeof LISTING_CONFIG].term as string]: { order } }];
}

export default buildElasticsearchSort;
