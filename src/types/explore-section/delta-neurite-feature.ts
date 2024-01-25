export interface NeuriteFeature {
  '@type': string;
  cumulatedLength: {
    unitCode: string;
    value: number;
  };
  longestBranchLength: {
    unitCode: string;
    value: number;
  };
  longestBranchNumberOfNodes: number;
  name: string;
  numberOfProjections: number;
  projectionBrainRegion: BrainRegionLabelCount[];
  traversedBrainRegion: BrainRegionLabelCount[];
}

interface BrainRegionLabelCount {
  brainRegion: {
    '@id': string;
    label?: string;
  };
  count: number;
}
