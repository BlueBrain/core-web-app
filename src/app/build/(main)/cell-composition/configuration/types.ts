import { CalculatedCompositionNode, CompositionLink } from '@/types/composition/calculation';

export interface AboutNode extends CalculatedCompositionNode {
  nodes: AboutNode[];
  max: number;
  value: number;
}

export type SankeyLinksReducerAcc = {
  links: CompositionLink[];
  nodes: CalculatedCompositionNode[];
  type: string;
  value: string;
};
