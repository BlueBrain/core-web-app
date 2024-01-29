import { DataType } from '@/constants/explore-section/list-views';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/data-types/experiment-data-types';
import { SIMULATION_DATA_TYPES } from '@/constants/explore-section/data-types/simulation-data-types';
import { DataTypeConfig, DataTypeGroup } from '@/types/explore-section/data-types';
import {
  BASE_EXPERIMENTAL_EXPLORE_PATH,
  BASE_MODEL_EXPLORE_PATH,
} from '@/constants/explore-section/paths';
import { MODEL_DATA_TYPES } from '@/constants/explore-section/data-types/model-data-types';

type DataTypeGroupConfig = {
  title: string;
  basePath: string;
  config: Partial<Record<DataType, DataTypeConfig>>;
};

export const DATA_TYPE_GROUPS_CONFIG: Record<DataTypeGroup, DataTypeGroupConfig> = {
  [DataTypeGroup.ExperimentalData]: {
    title: 'Experimental Data',
    basePath: BASE_EXPERIMENTAL_EXPLORE_PATH,
    config: EXPERIMENT_DATA_TYPES,
  },
  [DataTypeGroup.ModelData]: {
    title: 'Model Data',
    basePath: BASE_MODEL_EXPLORE_PATH,
    config: MODEL_DATA_TYPES,
  },
  [DataTypeGroup.SimulationData]: {
    title: 'Simulation Data',
    basePath: '',
    config: SIMULATION_DATA_TYPES,
  },
};
