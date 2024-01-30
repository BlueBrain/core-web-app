import { DefaultBrainRegionType } from '@/state/brain-regions/types';

export const BRAIN_REGION_PREFIX = 'http://api.brain-map.org/api/v2/data/Structure/';
export const ROOT_BRAIN_REGION_URI = 'http://api.brain-map.org/api/v2/data/Structure/997';

export const BASIC_CELL_GROUPS_AND_REGIONS_ID = 'http://api.brain-map.org/api/v2/data/Structure/8';

export const DEFAULT_BRAIN_REGION: DefaultBrainRegionType = {
  value: {
    id: 'http://api.brain-map.org/api/v2/data/Structure/558',
    title: 'Primary somatosensory area, nose, layer 1',
    leaves: null,
  },
};

export const DEFAULT_BRAIN_REGION_STORAGE_KEY = 'lastClickedRegionId';

export const BRAIN_VIEW_DEFAULT = 'https://neuroshapes.org/BrainRegion';
export const BRAIN_VIEW_LAYER = 'https://bbp.epfl.ch/ontologies/core/bmo/BrainLayer';
