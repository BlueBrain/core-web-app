import { BrainRegion, BrainViewId } from '@/types/ontologies';

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

export type ClassNexus = {
  '@id': string;
  color_hex_triplet: string; // TODO: Is this really there?
  color: string;
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
  subClassOf: string[];
};
type BrainLocationNexus = {
  brainRegion: ClassNexus;
};
type MeshNexusSource = {
  brainRegion: string;
  distribution: MeshDistributionNexus;
  brainLocation: BrainLocationNexus;
};
export type BrainRegionOntologyViewNexus = {
  '@id': BrainViewId;
  hasLeafHierarchyProperty: string;
  hasParentHierarchyProperty: "isPartOf" | "isLayerPartOf";
  hasChildrenHierarchyProperty: string;
  label: string;
};

export type SerializedBrainRegionsAndVolumesResponse = {
  brainRegions: BrainRegion[];
  volumes: { [key: string]: number };
};
