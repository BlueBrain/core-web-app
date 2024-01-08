export type DefaultBrainViewId = 'https://neuroshapes.org/BrainRegion';
export type BrainLayerViewId = 'https://bbp.epfl.ch/ontologies/core/bmo/BrainLayer';
export type BrainViewId = DefaultBrainViewId | BrainLayerViewId;

export type Ancestor = Record<string, BrainViewId>;

export type BrainRegion = {
  id: string;
  isPartOf: string | null;
  isLayerPartOf: string | null;
  title: string;
  notation: string;
  colorCode: string;
  items?: BrainRegion[];
  leaves?: string[];
  ancestors?: Ancestor[];
  hasLayerPart: string[];
  hasPart: string[];
  view?: BrainViewId;
  representedInAnnotation: boolean;
  itemsInAnnotation?: boolean;
};

export type Mesh = {
  contentUrl: string;
  brainRegion: string;
};

export type BrainRegionOntologyView = {
  id: BrainViewId;
  leafProperty: string;
  parentProperty: "isPartOf" | "isLayerPartOf";
  childrenProperty: string;
  title: string;
};

export type BrainRegionOntology = {
  brainRegions: BrainRegion[];
  views: BrainRegionOntologyView[] | null;
  volumes: { [key: string]: number };
};

export type BrainRegionAnnotationIndex = {
  [key: string]: {
    items?: BrainRegion[];
    parts: string[] | undefined;
    representedInAnnotation: boolean;
  };
};

export type AnnotationLookup = {
  representedInAnnotation: boolean;
  hasPart: string[];
  hasLayerPart: string[];
};
