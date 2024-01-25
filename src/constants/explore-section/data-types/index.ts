import { DataType } from '@/constants/explore-section/list-views';
import { SIMULATION_DATA_TYPES } from '@/constants/explore-section/data-types/simulation-data-types';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/data-types/experiment-data-types';
import { DataTypeConfig } from '@/types/explore-section/data-types';

export const DATA_TYPES_TO_CONFIGS: Record<DataType, DataTypeConfig> = {
  ...SIMULATION_DATA_TYPES,
  ...EXPERIMENT_DATA_TYPES,
};
