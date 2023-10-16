import { Filter } from '@/components/Filter/types';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/explore-fields-config';

export default function columnKeyToFilter(key: string, brainRegionLabels?: string[]): Filter {
  const fieldConfig = EXPLORE_FIELDS_CONFIG[key];

  switch (fieldConfig.filter) {
    case 'checkList':
      return {
        field: key,
        type: 'checkList',
        value: (key === 'brainRegion' && brainRegionLabels) || [],
        aggregationType: 'buckets',
      };
    case 'checkListInference':
      return {
        field: key,
        type: 'checkListInference',
        value: [],
        aggregationType: 'buckets',
      };
    case 'dateRange':
      return {
        field: key,
        type: 'dateRange',
        value: { gte: null, lte: null },
        aggregationType: 'stats',
      };
    case 'valueRange':
      return {
        field: key,
        type: 'valueRange',
        value: { gte: null, lte: null },
        aggregationType: 'stats',
      };
    case 'valueOrRange':
      return {
        field: key,
        type: 'valueOrRange',
        value: null,
        aggregationType: 'buckets',
      };
    default:
      return {
        field: key,
        aggregationType: null,
        type: null,
        value: null,
      };
  }
}
