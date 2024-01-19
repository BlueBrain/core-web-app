export type DefaultBrainViewId = 'https://neuroshapes.org/BrainRegion';
export type BrainLayerViewId = 'https://bbp.epfl.ch/ontologies/core/bmo/BrainLayer';
export type BrainViewId = DefaultBrainViewId | BrainLayerViewId;

export type Ancestor = Record<string, BrainViewId>;

export type BrainRegion = {
  id: string;
  isPartOf: string | null;
  isLayerPartOf: string | null;
  label: string; // Confirmed by Cristina; "label" should always be present (in the ontology).
  title?: string; // TODO: Check whether this type actually exists; it may be something that we invented for some reason.
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
