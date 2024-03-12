import { SIMULATION_DATA_TYPES } from '@/constants/explore-section/data-types/simulation-data-types';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/data-types/experiment-data-types';
import { MODEL_DATA_TYPES } from '@/constants/explore-section/data-types/model-data-types';

export const DATA_TYPES_TO_CONFIGS = {
  ...SIMULATION_DATA_TYPES,
  ...EXPERIMENT_DATA_TYPES,
  ...MODEL_DATA_TYPES,
};
