export type StepperTypeName = 'Number of steps' | 'Step size';

export interface StepperType {
  name: StepperTypeName;
  value: number;
}

interface RangeValue {
  min: number;
  max: number;
  start: number;
  end: number;
  step: number;
  stepper: StepperType;
}

type ExpDesignerBaseParameter = {
  id: string;
  name: string;
  disabled?: boolean;
  hidden?: boolean;
};

export interface ExpDesignerNumberParameter extends ExpDesignerBaseParameter {
  type: 'number';
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
}

export interface ExpDesignerRangeParameter extends ExpDesignerBaseParameter {
  type: 'range';
  value: RangeValue;
  unit: string;
}

export interface ExpDesignerStringParameter extends ExpDesignerBaseParameter {
  type: 'string';
  value: string;
}

export interface DropdownOptionType {
  label: string;
  value: string;
}

export interface ExpDesignerDropdownParameter extends ExpDesignerBaseParameter {
  type: 'dropdown';
  value: string;
  options: DropdownOptionType[];
}

export interface ExpDesignerMultipleDropdownParameter extends ExpDesignerBaseParameter {
  type: 'multipleDropdown';
  value: string[];
  options: DropdownOptionType[];
}

export interface ExpDesignerTargetParameter extends ExpDesignerBaseParameter {
  type: 'targetDropdown';
  value: string;
}

export interface ExpDesignerTargetDropdownGroupParameter extends ExpDesignerBaseParameter {
  type: 'targetDropdownGroup';
  value: string[];
}

export interface ExpDesignerPositionParameter extends ExpDesignerBaseParameter {
  type: 'position';
  value: [number, number, number];
}

export interface ExpDesignerRadioBtnParameter extends ExpDesignerBaseParameter {
  type: 'radioButton';
  value: string;
  options: string[];
}

export interface ExpDesignerCheckboxParameter extends ExpDesignerBaseParameter {
  type: 'checkbox';
}

export interface ExpDesignerCheckboxGroupParameter extends ExpDesignerBaseParameter {
  type: 'checkboxGroup';
  value: ExpDesignerCheckboxParameter[];
}

export interface ExpDesignerGroupParameter extends ExpDesignerBaseParameter {
  type: 'group';
  value: ExpDesignerParam[];
}

export type ExpDesignerParam =
  | ExpDesignerNumberParameter
  | ExpDesignerDropdownParameter
  | ExpDesignerMultipleDropdownParameter
  | ExpDesignerRangeParameter
  | ExpDesignerStringParameter
  | ExpDesignerTargetParameter
  | ExpDesignerPositionParameter
  | ExpDesignerRadioBtnParameter
  | ExpDesignerTargetDropdownGroupParameter
  | ExpDesignerCheckboxParameter
  | ExpDesignerCheckboxGroupParameter
  | ExpDesignerGroupParameter;

type ExpDesignerConfigBaseType = {
  [key in ExpDesignerSectionName]: ExpDesignerParam[];
};

export type ExpDesignerConfig = ExpDesignerConfigBaseType & {
  stimuli: ExpDesignerStimulusParameter[];
};

export type TargetList = string[];

export type ExpDesignerSectionName =
  | 'setup'
  | 'imaging'
  | 'recording'
  | 'input'
  | 'stimuli'
  | 'analysis';

// STIMULUS SPECIFIC TYPES

export type StimulusType =
  | 'current_clamp'
  | 'voltage_clamp'
  | 'spikes'
  | 'extracellular_stimulation'
  | 'conductance';

export type StimulusModule =
  | 'linear'
  | 'relative_linear'
  | 'pulse'
  | 'subthreshold'
  | 'hyperpolarizing'
  | 'seclamp'
  | 'noise'
  | 'shot_noise'
  | 'relative_shot_noise'
  | 'absolute_shot_noise'
  | 'ornstein_uhlenbeck'
  | 'relative_ornstein_uhlenbeck';

export interface StimulusTypeDropdownOptionType {
  label: string;
  value: StimulusType;
}

export interface StimulusTypeDropdown extends ExpDesignerDropdownParameter {
  id: 'type';
  options: StimulusTypeDropdownOptionType[];
}

export interface StimulusModuleDropdownOptionType {
  label: string;
  value: StimulusModule;
}

export interface StimulusModuleDropdown extends ExpDesignerDropdownParameter {
  id: 'module';
  options: StimulusModuleDropdownOptionType[];
}

export type ExpDesignerStimulusValueParameterType =
  | StimulusTypeDropdown
  | StimulusModuleDropdown
  | ExpDesignerNumberParameter
  | ExpDesignerTargetParameter;

export interface ExpDesignerStimulusParameter extends ExpDesignerBaseParameter {
  type: 'group';
  value: ExpDesignerStimulusValueParameterType[];
}
