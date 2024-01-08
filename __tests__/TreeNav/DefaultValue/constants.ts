/* istanbul ignore file */

export const previouslySelectedRegion = {
  value: {
    id: 'http://api.brain-map.org/api/v2/data/Structure/1057',
    title: 'Gustatory areas',
    leaves: [
      'http://api.brain-map.org/api/v2/data/Structure/662',
      'http://api.brain-map.org/api/v2/data/Structure/148',
      'http://api.brain-map.org/api/v2/data/Structure/614454308',
      'http://api.brain-map.org/api/v2/data/Structure/638',
      'http://api.brain-map.org/api/v2/data/Structure/614454309',
      'http://api.brain-map.org/api/v2/data/Structure/36',
      'http://api.brain-map.org/api/v2/data/Structure/187',
    ],
    representedInAnnotation: true,
  },
  brainRegionHierarchyState: {
    'http://api.brain-map.org/api/v2/data/Structure/8': {
      'http://api.brain-map.org/api/v2/data/Structure/567': {
        'http://api.brain-map.org/api/v2/data/Structure/688': {
          'http://api.brain-map.org/api/v2/data/Structure/695': {
            'http://api.brain-map.org/api/v2/data/Structure/315': {
              'http://api.brain-map.org/api/v2/data/Structure/95': null,
            },
          },
        },
      },
    },
  },
};

export const brainRegionSelectorId = 'selectedBrainRegion';
export const brainRegionSelector = `#${brainRegionSelectorId}`;

export const hierarchySelectorId = 'hierarchyOpened';
export const hierarchySelector = `#${hierarchySelectorId}`;

it('selector is id', () => {
  brainRegionSelector.startsWith('#') && hierarchySelector.startsWith('#');
});
