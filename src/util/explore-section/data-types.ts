import intersection from 'lodash/intersection';
import isEmpty from 'lodash/isEmpty';
import { DATA_TYPES } from '@/constants/explore-section/experiment-types';
import { DataGroups } from '@/types/explore-section/data-groups';

export function filterDataTypes(toKeep: DataGroups[]) {
  return Object.values(DATA_TYPES).filter(
    (dataType) => !isEmpty(intersection(dataType.groups, toKeep))
  );
}
