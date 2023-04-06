import { CompositionNode } from '@/types/composition';
import { CompositionLink } from '@/util/composition/types';

export interface AboutNode extends CompositionNode {
  nodes: AboutNode[];
  max: number;
  value: number;
}

export type SankeyLinksReducerAcc = {
  links: CompositionLink[];
  nodes: CompositionNode[];
  type: string;
  value: string;
};
