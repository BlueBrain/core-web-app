import { Filter } from '@/components/Filter/types';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/fields-config';
import { FilterTypeEnum } from '@/types/explore-section/filters';

export default function columnKeyToFilter(key: string): Filter {
  const fieldConfig = EXPLORE_FIELDS_CONFIG[key];
  switch (fieldConfig.filter) {
    case FilterTypeEnum.CheckList:
      return {
        field: key,
        type: FilterTypeEnum.CheckList,
        value: [],
        aggregationType: 'buckets',
      };
    case FilterTypeEnum.DateRange:
      return {
        field: key,
        type: FilterTypeEnum.DateRange,
        value: { gte: null, lte: null },
        aggregationType: 'stats',
      };
    case FilterTypeEnum.ValueRange:
      return {
        field: key,
        type: FilterTypeEnum.ValueRange,
        value: { gte: null, lte: null },
        aggregationType: 'stats',
      };
    case FilterTypeEnum.ValueOrRange:
      return {
        field: key,
        type: FilterTypeEnum.ValueOrRange,
        value: null,
        aggregationType: 'buckets',
      };
    case FilterTypeEnum.Text:
      return {
        field: key,
        type: FilterTypeEnum.Text,
        value: '',
        aggregationType: null,
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
