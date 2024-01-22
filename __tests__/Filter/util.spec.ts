import data from './tree-data.min.json';
import { findTitleAndCollectParentBrainRegions } from '@/components/Filter/util';
import { BrainRegion } from '@/types/ontologies';

const expectedFindForD: BrainRegion[] = [
  {
    id: 'http://api.brain-map.org/api/v2/data/Structure/3',
    isPartOf: 'http://api.brain-map.org/api/v2/data/Structure/2',
    isLayerPartOf: null,
    title: 'C',
    notation: 'C-NOTATION',
    colorCode: '#0000FF',
    hasLayerPart: [],
    hasPart: [],
    representedInAnnotation: false,
  },
  {
    id: 'http://api.brain-map.org/api/v2/data/Structure/2',
    isPartOf: 'http://api.brain-map.org/api/v2/data/Structure/1',
    isLayerPartOf: null,
    title: 'B',
    notation: 'B-NOTATION',
    colorCode: '#00FF00',
    hasLayerPart: [],
    hasPart: [],
    representedInAnnotation: false,
  },
  {
    id: 'http://api.brain-map.org/api/v2/data/Structure/1',
    isPartOf: null,
    isLayerPartOf: null,
    title: 'A',
    notation: 'A-NOTATION',
    colorCode: '#FF0000',
    hasLayerPart: [],
    hasPart: [],
    representedInAnnotation: false,
  },
];
const expectedFindForC: BrainRegion[] = [
  {
    id: 'http://api.brain-map.org/api/v2/data/Structure/2',
    isPartOf: 'http://api.brain-map.org/api/v2/data/Structure/1',
    isLayerPartOf: null,
    title: 'B',
    notation: 'B-NOTATION',
    colorCode: '#00FF00',
    hasLayerPart: [],
    hasPart: [],
    representedInAnnotation: false,
  },
  {
    id: 'http://api.brain-map.org/api/v2/data/Structure/1',
    isPartOf: null,
    isLayerPartOf: null,
    title: 'A',
    notation: 'A-NOTATION',
    colorCode: '#FF0000',
    hasLayerPart: [],
    hasPart: [],
    representedInAnnotation: false,
  },
];

describe('findTitleAndCollectParentBrainRegions', () => {
  it('should return null if nodes is null', () => {
    const result = findTitleAndCollectParentBrainRegions(null, 'A');
    expect(result).toBeNull();
  });

  it('should return an empty array if the target title is not found', () => {
    const result = findTitleAndCollectParentBrainRegions(data as BrainRegion[], 'Z');
    expect(result).toBeNull();
  });

  it('should return the correct parent BrainRegions when multiple target titles are present', () => {
    const result = findTitleAndCollectParentBrainRegions(data, 'D');
    expect(result).toEqual(expectedFindForD);
  });

  it('should return the correct parent BrainRegions when multiple target titles are present', () => {
    const result = findTitleAndCollectParentBrainRegions(data as BrainRegion[], 'C');
    expect(result).toEqual(expectedFindForC);
  });

  it('should handle empty nodes correctly', () => {
    const result = findTitleAndCollectParentBrainRegions([], 'A');
    expect(result).toBeNull();
  });

  it('should handle null nodes correctly', () => {
    const result = findTitleAndCollectParentBrainRegions(null, 'A');
    expect(result).toBeNull();
  });
});
