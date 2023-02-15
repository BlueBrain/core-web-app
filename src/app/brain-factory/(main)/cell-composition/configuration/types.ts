import { Link, Node } from '@/types/atlas';

export interface AboutNode extends Node {
  nodes: AboutNode[];
  max: number;
  value: number;
}

export type SankeyLinksReducerAcc = {
  links: Link[];
  nodes: Node[];
  type: string;
  value: string;
};
