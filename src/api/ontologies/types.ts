type MeshDistributionNexus = {
  contentUrl: string;
};
export type MeshSourceNexus = {
  _source: MeshNexusSource;
};
export type BrainRegionNexus = {
  '@id': string;
  color_hex_triplet: string;
  isPartOf: string;
  label: string;
  prefLabel: string;
  hasLeafRegionPart: string[] | string;
};
type BrainLocationNexus = {
  brainRegion: BrainRegionNexus;
};
type MeshNexusSource = {
  brainRegion: string;
  distribution: MeshDistributionNexus;
  brainLocation: BrainLocationNexus;
};
