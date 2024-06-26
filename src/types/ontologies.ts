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
  representedInAnnotation?: boolean; // This property is removed for brainRegionsWithRepresentationAtom
};

type SearchOption = {
  ancestors: Record<string, BrainViewId>[];
  label: string;
  leaves?: string[];
  value: string;
};

export type BrainRegionWithRepresentation = BrainRegion & SearchOption;

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
  };
};

export type AnnotationLookup = {
  hasPart: string[];
  hasLayerPart: string[];
};
