import { DefaultBrainRegionType } from '@/state/brain-regions/types';

export const previouslySelectedRegion = {
  value: {
    id: 'http://api.brain-map.org/api/v2/data/Structure/315',
    title: 'Isocortex',
    leaves: [],
    representedInAnnotation: true,
  },
} satisfies DefaultBrainRegionType;

export const brainRegionSelectorId = 'selectedBrainRegion';
export const brainRegionSelector = `#${brainRegionSelectorId}`;

export const hierarchySelectorId = 'hierarchyOpened';
export const hierarchySelector = `#${hierarchySelectorId}`;

export const defaultIncreasedTimeout = 10_000;
export const regionContainerSelector = `span[title]`;

export const brainTreeUntilIsocortex = {
  'http://api.brain-map.org/api/v2/data/Structure/8': {
    'http://api.brain-map.org/api/v2/data/Structure/567': {
      'http://api.brain-map.org/api/v2/data/Structure/688': {
        'http://api.brain-map.org/api/v2/data/Structure/695': null,
      },
    },
  },
};

// Brain stem -> Interbrain
export const queryParamRegion =
  'http%3A%2F%2Fapi.brain-map.org%2Fapi%2Fv2%2Fdata%2FStructure%2F1129';
