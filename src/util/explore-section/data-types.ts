import { DATA_TYPES } from '@/constants/explore-section/experiment-types';
import { DataGroups } from '@/types/explore-section/data-groups';

export function filterDataTypes(toKeep: DataGroups) {
  return Object.values(DATA_TYPES).filter((dataType) => dataType.groups.includes(toKeep));
}
