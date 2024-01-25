import groupBy from 'lodash/groupBy';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/fields-config';
import { DataType } from '@/constants/explore-section/list-views';
import { DATA_TYPES_TO_CONFIGS } from '@/constants/explore-section/data-types';

export function getGroupedCardFields(dataType: DataType) {
  const cardFields = DATA_TYPES_TO_CONFIGS[dataType]?.cardViewFields || [];

  return groupBy(cardFields, (item) => EXPLORE_FIELDS_CONFIG[item.field].group || 'Metadata');
}
