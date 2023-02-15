export type CompositionUnit = {
  count: number;
  density: number;
};

export type Link = { source: string; target: string; value?: number };

export type NodeRaw = {
  about: string;
  id: string;
  label: string;
  neuron_composition: CompositionUnit;
  parent_id: string;
};

export type Node = {
  about: string;
  id: string;
  label: string;
  neuronComposition: CompositionUnit;
  parentId: string | null;
  leaves: string[];
  composition?: number;
  items?: Node[];
};

type UnitCode = {
  density: string;
};

// The composition file structure
export type Composition = {
  version: number;
  unitCode: UnitCode;
  hasPart: { [key: string]: LeafNode };
};

// Pair of neuron/glia compositions
export type CompositionPair = {
  neuron: CompositionUnit;
  glia: CompositionUnit;
};

// Node of a leaf region
export type LeafNode = {
  label: string;
  about: string;
  hasPart: { [key: string]: LeafNode };
  composition: CompositionPair;
};

// Node type when calculating the compositions
export type CalculationNode = {
  about: string;
  composition: CompositionPair;
  id: string;
  label: string;
  parentId: string | null;
  leaves: Set<string>;
};

// Link type when calculating the compositions
export type CalculationLink = {
  source: string;
  target: string;
};

// The analysed composition that is produced after recursively analysing the composition
export type AnalysedComposition = {
  nodes: Node[];
  links: Link[];
  totalComposition: CompositionPair;
  composition: Composition;
  volumes: { [key: string]: number };
};

export type CompositionRaw = {
  nodes: NodeRaw[];
  links: Link[];
};

export type MeshDistributionRaw = {
  name: string;
  content_url: string;
  encoding_format: string;
  content_size: string;
  data_sample_modality?: string;
};

export type MeshDistribution = {
  id: string;
  name: string;
  contentUrl: string;
  encodingFormat: string;
  contentSize: string;
  dataSampleModality?: string;
};

export type BrainRegionRaw = {
  id: string;
  label: string;
  parentID: string;
  title: string;
  color_code: string;
  composition_details: CompositionRaw & { neuron_composition: CompositionUnit };
  distribution: MeshDistributionRaw;
  value: string;
  leaves?: string[];
};

export type CompositionWithSummary = AnalysedComposition & {
  neuronComposition: CompositionUnit;
};

export type BrainRegion = {
  id: string;
  parentId?: string;
  title: string;
  colorCode: string;
  composition: CompositionWithSummary;
  items?: BrainRegion[];
  leaves?: string[];
};

export type BrainRegionWOComposition = Omit<BrainRegion, 'composition'>;
