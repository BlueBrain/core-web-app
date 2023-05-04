import { ES_TERMS } from '@/constants/explore-section';

type ElasticsearchSort = Array<{ [field: string]: { order: 'asc' | 'desc' } }>;

function buildElasticsearchSort({
  field,
  order,
}: {
  field: string;
  order: 'asc' | 'desc';
}): ElasticsearchSort {
  return [{ [ES_TERMS[field as keyof typeof ES_TERMS].term]: { order } }];
}

export default buildElasticsearchSort;
