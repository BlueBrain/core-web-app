export type CompositionUnit = {
  count: number;
  density: number;
};

export type CompositionNode = {
  about: string;
  id: string;
  label: string;
  parentId: string | null;
  neuronComposition: CompositionUnit;
  leaves: string[];
  composition?: number;
  items?: CompositionNode[];
};

// The composition file structure
export type Composition = {
  version: number;
  unitCode: { density: string };
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
