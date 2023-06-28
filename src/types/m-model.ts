export type RequiredParamRawNames = 'radius' | 'randomness' | 'step_size';

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
  step_size: StepSizeInterface | number;
}

export type NeuriteType = 'basal_dendrite' | 'apical_dendrite' | 'axon';

type MModelParamConfigBase = Record<NeuriteType, BasicParams>;

export interface MModelParamConfig extends MModelParamConfigBase {
  origin: number[];
  grow_types: string[];
  diameter_params: {
    method: 'default';
  };
}
