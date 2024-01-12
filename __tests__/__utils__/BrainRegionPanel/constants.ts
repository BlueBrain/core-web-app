import { DefaultBrainRegionType } from '@/state/brain-regions/types';

export const previouslySelectedRegion = {
  value: {
    id: 'http://api.brain-map.org/api/v2/data/Structure/315',
    title: 'Isocortex',
    leaves: [],
    representedInAnnotation: true,
  },
  brainRegionHierarchyState: {
    'http://api.brain-map.org/api/v2/data/Structure/8': {
      'http://api.brain-map.org/api/v2/data/Structure/567': {
        'http://api.brain-map.org/api/v2/data/Structure/688': {
          'http://api.brain-map.org/api/v2/data/Structure/695': {
            'http://api.brain-map.org/api/v2/data/Structure/315': null,
          },
        },
      },
    },
  },
} satisfies DefaultBrainRegionType;

export const brainRegionSelectorId = 'selectedBrainRegion';
export const brainRegionSelector = `#${brainRegionSelectorId}`;

export const hierarchySelectorId = 'hierarchyOpened';
export const hierarchySelector = `#${hierarchySelectorId}`;

export const defaultIncreasedTimeout = 10_000;
export const regionContainerSelector = `span[title]`;
