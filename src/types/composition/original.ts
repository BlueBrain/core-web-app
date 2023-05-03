// The composition file structure
export type OriginalComposition = {
  version: number;
  unitCode: { density: string };
  hasPart: { [key: string]: OriginalCompositionNode };
};

// Node of a leaf region
export type OriginalCompositionNode = {
  label: string;
  about: string;
  hasPart: { [key: string]: OriginalCompositionNode };
  composition: OriginalCompositionPair;
  extendedNodeId: string;
};

export type OriginalCompositionPair = {
  neuron: OriginalCompositionUnit;
  glia: OriginalCompositionUnit;
};

export type OriginalCompositionUnit = {
  density: number;
};

// Workaround to fit current Composition into the workflow config
// To be refactored/removed
export type CompositionOverrideLeafNode = OriginalCompositionNode & {
  density?: number;
};
