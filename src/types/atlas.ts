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
  parentId: string;
};

export type Composition = {
  nodes: Node[];
  links: Link[];
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
};

export type CompositionWithSummary = Composition & {
  neuronComposition: CompositionUnit;
};

export type BrainRegion = {
  id: string;
  parentId?: string;
  title: string;
  colorCode: string;
  composition: CompositionWithSummary;
  items?: BrainRegion[];
};

export type BrainRegionWOComposition = Omit<BrainRegion, 'composition'>;
