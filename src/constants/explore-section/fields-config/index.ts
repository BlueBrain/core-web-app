import { ExploreFieldsConfigProps } from '@/constants/explore-section/fields-config/types';
import { EXPERIMENTAL_DATA_FIELDS_CONFIG } from '@/constants/explore-section/fields-config/experimental-data';
import { LITERATURE_FIELDS_CONFIG } from '@/constants/explore-section/fields-config/literature';
import { SIMULATION_CAMPAIGN_FIELDS_CONFIG } from '@/constants/explore-section/fields-config/simulation-campaign';
import { COMMON_FIELDS_CONFIG } from '@/constants/explore-section/fields-config/common';

const EXPLORE_FIELDS_CONFIG: ExploreFieldsConfigProps = {
  ...COMMON_FIELDS_CONFIG,
  ...EXPERIMENTAL_DATA_FIELDS_CONFIG,
  ...LITERATURE_FIELDS_CONFIG,
  ...SIMULATION_CAMPAIGN_FIELDS_CONFIG,
};

export default EXPLORE_FIELDS_CONFIG;
