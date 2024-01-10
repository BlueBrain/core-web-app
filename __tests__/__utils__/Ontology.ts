import { BrainRegionOntology } from '@/types/ontologies';
import { mockBrainRegions } from '__tests__/__utils__/SelectedBrainRegions';

export const defaultOntologyMock = {
  __esModule: true,
  getBrainRegionOntology: jest.fn().mockImplementation(
    () =>
      new Promise((resolve) => {
        const mockResponse: BrainRegionOntology = {
          brainRegions: mockBrainRegions,
          views: [
            {
              id: 'https://neuroshapes.org/BrainRegion',
              leafProperty: 'hasLeafRegionPart',
              parentProperty: 'isPartOf',
              childrenProperty: 'hasPart',
              title: 'BrainRegion',
            },
          ],
          volumes: {},
        };
        resolve(mockResponse);
      })
  ),
};
