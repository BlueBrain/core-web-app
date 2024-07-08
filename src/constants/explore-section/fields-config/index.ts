import { SINGLE_NEURON_FIELDS_CONFIG } from './single-neuron-simulation';
import { ExploreFieldsConfigProps } from '@/constants/explore-section/fields-config/types';
import { EXPERIMENTAL_DATA_FIELDS_CONFIG } from '@/constants/explore-section/fields-config/experimental-data';
import { LITERATURE_FIELDS_CONFIG } from '@/constants/explore-section/fields-config/literature';
import { SIMULATION_CAMPAIGN_FIELDS_CONFIG } from '@/constants/explore-section/fields-config/simulation-campaign';
import { COMMON_FIELDS_CONFIG } from '@/constants/explore-section/fields-config/common';
import { DeltaResource } from '@/types/explore-section/resources';
import { MODEL_DATA_FIELDS_CONFIG } from '@/constants/explore-section/fields-config/model-data';

// TODO: See comment in ./src/constants/explore-section/fields-config/literature.tsx
// (regarding what to do about this "any" type below)
const EXPLORE_FIELDS_CONFIG: ExploreFieldsConfigProps<any | DeltaResource> = {
  ...COMMON_FIELDS_CONFIG,
  ...EXPERIMENTAL_DATA_FIELDS_CONFIG,
  ...LITERATURE_FIELDS_CONFIG,
  ...SIMULATION_CAMPAIGN_FIELDS_CONFIG,
  ...SINGLE_NEURON_FIELDS_CONFIG,
  ...MODEL_DATA_FIELDS_CONFIG,
};

export default EXPLORE_FIELDS_CONFIG;
