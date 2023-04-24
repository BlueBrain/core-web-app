import { BrainRegion } from '@/types/ontologies';

type MeshDistributionNexus = {
  contentUrl: string;
};
export type MeshSourceNexus = {
  _source: MeshNexusSource;
};

type RegionVolume = {
  unitCode: string;
  value: number;
};

export type BrainRegionNexus = {
  '@id': string;
  color_hex_triplet: string;
  isPartOf: string;
  isLayerPartOf: string;
  label: string;
  notation: string;
  prefLabel: string;
  hasLeafRegionPart: string[] | string;
  hasLayerPart: string[];
  hasPart: string[];
  representedInAnnotation: boolean;
  regionVolume?: RegionVolume;
};
type BrainLocationNexus = {
  brainRegion: BrainRegionNexus;
};
type MeshNexusSource = {
  brainRegion: string;
  distribution: MeshDistributionNexus;
  brainLocation: BrainLocationNexus;
};
export type BrainRegionOntologyViewNexus = {
  '@id': string;
  hasLeafHierarchyProperty: string;
  hasParentHierarchyProperty: string;
  hasChildrenHierarchyProperty: string;
  label: string;
};

export type SerializedBrainRegionsAndVolumesResponse = {
  brainRegions: BrainRegion[];
  volumes: { [key: string]: number };
};
