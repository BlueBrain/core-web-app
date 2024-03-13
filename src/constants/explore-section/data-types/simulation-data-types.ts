import { DataType } from '@/constants/explore-section/list-views';
import { Field } from '@/constants/explore-section/fields-config/enums';
import { DataTypeConfig, DataTypeGroup } from '@/types/explore-section/data-types';

export const SIMULATION_DATA_TYPES: { [key: string]: DataTypeConfig } = {
  [DataType.SimulationCampaigns]: {
    title: 'Simulation campaigns',
    group: DataTypeGroup.SimulationData,
    name: 'simulation-campaigns',
    columns: [Field.SimulationCampaignName, Field.BrainConfiguration, Field.CreatedAt],
    curated: false,
  },
};
