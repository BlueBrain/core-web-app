export type BrainRegion = {
  id: string;
  isPartOf: string | null;
  isLayerPartOf: string | null;
  title: string;
  notation: string;
  colorCode: string;
  items?: BrainRegion[];
  leaves?: string[];
  ancestors?: string[];
  hasLayerPart: string[];
  hasPart: string[];
  view?: string;
  representedInAnnotation: boolean;
  itemsInAnnotation?: boolean;
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
