import { OriginalComposition, OriginalCompositionUnit } from '@/types/composition/original';

type CompositionNodeBase = {
  about: string;
  id: string;
  extendedNodeId: string;
  label: string;
  parentId: string | null;
  leaves: string[];
  relatedNodes: string[];
};

// Node type when calculating the compositions
export type CalculationNode = CompositionNodeBase & {
  countPair: CountPair;
};

export type CountPair = {
  neuron: number;
  glia: number;
};

// Link type when calculating the compositions
export type CalculationLink = {
  source: string;
  target: string;
};
export type CompositionLink = CalculationLink & { value?: number };

export type CalculatedCompositionPair = OriginalCompositionUnit & { count: number };

export type CalculatedCompositionNode = CompositionNodeBase & {
  neuronComposition: CalculatedCompositionPair;
  composition?: number;
  items?: CalculatedCompositionNode[];
};

export type CalculatedCompositionNeuronGlia = {
  neuron: CalculatedCompositionPair;
  glia: CalculatedCompositionPair;
};

// The analysed composition that is produced after recursively analysing the composition
export type AnalysedComposition = {
  nodes: CalculatedCompositionNode[];
  links: CompositionLink[];
  totalComposition: CalculatedCompositionNeuronGlia;
  composition: OriginalComposition;
};
