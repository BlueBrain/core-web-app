export type RequiredParamRawNames = 'radius' | 'randomness' | 'step_size';
export type RequiredParamDisplayNames = 'Radius' | 'Randomness' | 'Step size';

export type ParamsRawNames =
  | (RequiredParamRawNames & 'targeting')
  | 'metric'
  | 'orientation'
  | 'growth_method'
  | 'branching_method'
  | 'modify'
  | 'tree_type';

interface StepSizeInterface {
  norm: {
    mean: number;
    std: number;
  };
}

export interface BasicParams
  extends Record<ParamsRawNames, string | number | null | StepSizeInterface> {
  metric: string;
  randomness: number;
  targeting: number;
  radius: number;
  orientation: null;
  growth_method: string;
  branching_method: string;
  modify: null;
  tree_type: number;
  step_size: StepSizeInterface;
}

export type NeuriteType = 'basal_dendrite' | 'apical_dendrite' | 'axon';

type ParamConfigBase = Record<NeuriteType, BasicParams>;

export interface ParamConfig extends ParamConfigBase {
  origin: number[];
  grow_types: string[];
  diameter_params: {
    method: 'default';
  };
}

export interface SynthesisPreviewInterface {
  resources: {
    parameters_id: string;
    distributions_id: string;
  };
  overrides: ParamConfigBase | {};
}

export type SynthesisPreviewApiPlotNames = 'barcode' | 'diagram' | 'image' | 'synthesis';

export type SynthesisPreviewApiPlotResponse = Record<
  SynthesisPreviewApiPlotNames,
  {
    src: string;
  }
>;

export interface ParamInfo {
  displayName: RequiredParamDisplayNames;
  min: number;
  max: number;
  step: number;
}

export type ParamsToDisplay = Record<RequiredParamRawNames, ParamInfo>;
