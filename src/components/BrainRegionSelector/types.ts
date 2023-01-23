import { Distribution } from '@/components/BrainRegionVisualizationTrigger';

export type Composition = {
  count: number;
  density: number;
};

export type Link = { source: string; target: string; value?: number };

export type Node = {
  id: string;
  parent_id: string;
  about: string;
  glia_composition: Composition;
  label: string;
  neuron_composition: Composition;
};

export type CompositionNodesAndLinks = {
  nodes: Node[];
  links: Link[];
};

export type MeTypeDetailsProps = {
  densityOrCount: keyof Composition;
  gliaComposition?: Composition;
  neuronComposition?: Composition;
  nodes: CompositionNodesAndLinks['nodes'];
};

export interface MeTypeDetailsState extends MeTypeDetailsProps {
  colorCode: string;
  distribution: Distribution;
  id: string;
  title: string;
  color_code: string;
}
