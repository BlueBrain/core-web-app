import { DefaultBrainRegionType } from '@/state/brain-regions/types';

export const BRAIN_REGION_PREFIX = 'http://api.brain-map.org/api/v2/data/Structure/';
export const ROOT_BRAIN_REGION_URI = 'http://api.brain-map.org/api/v2/data/Structure/997';

export const BASIC_CELL_GROUPS_AND_REGIONS_ID = 'http://api.brain-map.org/api/v2/data/Structure/8';

export const DEFAULT_BRAIN_REGION: DefaultBrainRegionType = {
  value: {
    id: 'http://api.brain-map.org/api/v2/data/Structure/558',
    title: 'Primary somatosensory area, nose, layer 1',
    leaves: null,
    representedInAnnotation: true,
  },
  ancestors: [
    'http://api.brain-map.org/api/v2/data/Structure/8',
    'http://api.brain-map.org/api/v2/data/Structure/567',
    'http://api.brain-map.org/api/v2/data/Structure/688',
    'http://api.brain-map.org/api/v2/data/Structure/695',
    'http://api.brain-map.org/api/v2/data/Structure/315',
    'http://api.brain-map.org/api/v2/data/Structure/453',
    'http://api.brain-map.org/api/v2/data/Structure/322',
    'http://api.brain-map.org/api/v2/data/Structure/353',
  ],
};

export const DEFAULT_BRAIN_REGION_STORAGE_KEY = 'lastClickedRegionId';
