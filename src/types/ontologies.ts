export type BrainRegion = {
  id: string;
  isPartOf: string | null;
  isLayerPartOf: string | null;
  title: string;
  colorCode: string;
  items?: BrainRegion[];
  leaves?: string[];
  ancestors?: string[];
  hasLayerPart: string[];
  hasPart: string[];
  view?: string;
};
export type Mesh = {
  contentUrl: string;
  brainRegion: string;
};
export type BrainRegionOntologyView = {
  id: string;
  leafProperty: string;
  parentProperty: string;
  childrenProperty: string;
  title: string;
};
export type BrainRegionOntology = {
  brainRegions: BrainRegion[];
  views: BrainRegionOntologyView[] | null;
};
