import { BrainRegionOntology } from '@/types/ontologies';
import { mockBrainRegions } from '__tests__/__utils__/SelectedBrainRegions';

export const defaultOntologyMock = {
  __esModule: true,
  getBrainRegionOntology: jest.fn().mockImplementation(
    () =>
      new Promise((resolve) => {
        const mockVolumes = mockBrainRegions.reduce(
          (acc, curr) => ({ ...acc, [curr.id]: 1 }),
          {} as Record<string, number>
        );

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
          volumes: mockVolumes,
        };
        resolve(mockResponse);
      })
  ),
};
