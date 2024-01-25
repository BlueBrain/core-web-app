import { DataType } from '@/constants/explore-section/list-views';
import { Field } from '@/constants/explore-section/fields-config/enums';

export const SIMULATION_DATA_TYPES = {
  [DataType.SimulationCampaigns]: {
    title: 'Simulation campaigns',
    name: 'simulation-campaigns',
    columns: [Field.SimulationCampaignName, Field.BrainConfiguration, Field.CreatedAt],
    curated: false,
  },
};
