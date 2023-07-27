export type RequiredParamRawNames =
  | 'radius'
  | 'randomness'
  | 'step_size'
  | 'orientation'
  | 'targeting';
export type RequiredParamDisplayNames =
  | 'Radius'
  | 'Randomness'
  | 'Step size'
  | 'Orientation'
  | 'Targeting';

export type ParamsRawNames =
  | (RequiredParamRawNames & 'targeting')
  | 'metric'
  | 'growth_method'
  | 'branching_method'
  | 'modify'
  | 'tree_type';

export interface StepSizeInterface {
  norm: {
    mean: number;
    std: number;
  };
}

export type OrientationInterface = [number, number, number];

type BaseParamsType = Record<
  ParamsRawNames,
  number | string | null | OrientationInterface[] | StepSizeInterface
>;

export interface BasicParams extends BaseParamsType {
  metric: string;
  randomness: number;
  targeting: number;
  radius: number;
  orientation: OrientationInterface[];
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

export interface OrientationToDisplay {
  displayName: RequiredParamDisplayNames;
}

export type ParamsToDisplay = Record<RequiredParamRawNames, ParamInfo | OrientationToDisplay>;

export type MModelWorkflowOverrides = {
  [brainRegionId: string]: {
    [mTypeId: string]: {
      id: string;
      overrides: ParamConfig | {};
    };
  };
};

export type ModelChoice = 'canonical' | 'placeholder' | string;

export type ChangeModelAction = 'add' | 'remove';

export interface MModelMenuItem {
  label: string;
  annotation?: string;
  id: string;
}
