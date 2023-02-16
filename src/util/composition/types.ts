import { Composition, CompositionNode, CompositionPair } from '@/types/composition';

// Link type when calculating the compositions
export type CalculationLink = {
  source: string;
  target: string;
};
export type CompositionLink = CalculationLink & { value?: number };
// Node type when calculating the compositions
export type CalculationNode = {
  about: string;
  id: string;
  label: string;
  parentId: string | null;
  composition: CompositionPair;
  leaves: Set<string>;
};
// The analysed composition that is produced after recursively analysing the composition
export type AnalysedComposition = {
  nodes: CompositionNode[];
  links: CompositionLink[];
  totalComposition: CompositionPair;
  composition: Composition;
  volumes: { [key: string]: number };
  leaves?: string[];
};
