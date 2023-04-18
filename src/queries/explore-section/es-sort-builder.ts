import { ElasticsearchSort } from '@/types/explore-section';

export class ElasticsearchSortQueryBuilder {
  private sort: ElasticsearchSort;

  constructor ({ field, order }: { field: string; order: 'asc' | 'desc' }) {
    this.sort = {
      [field]: {
        order,
      },
    };
  }

  build (): ElasticsearchSort {
    return this.sort;
  }
}
