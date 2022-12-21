export interface DistributionSliderSeries {
  label: string;
  color: string;
  percentage: number; // TODO: This should take an absolute value
  isLocked: boolean;
  breakdown?: DistributionSliderSeries[];
}

export interface CellCompositionEntity {
  neuronCountValue: number;
  neuronDensityValue: number;
  gliaCountValue: number;
  gliaDensityValue: number;
}

export interface CellCompositionNode extends CellCompositionEntity {
  about: string;
  count: number;
  density: number;
  id: string;
  isLocked?: boolean;
  label: string;
  parent?: string;
}

export interface CellCompositionLink extends CellCompositionEntity {
  source: string;
  target: string;
  isLocked?: boolean;
  parent?: string;
}

export interface CellCompositionData extends CellCompositionEntity {
  count: number;
  density: number;
  nodes: CellCompositionNode[];
  links: CellCompositionLink[];
  parent?: string;
}
