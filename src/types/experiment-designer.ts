export type StepperTypeName = 'Number of steps' | 'Step size';

export type StepperType = {
  name: StepperTypeName;
  value: number;
};

type RangeValue = {
  min: number;
  max: number;
  start: number;
  end: number;
  step: number;
  stepper: StepperType;
};

type ExpDesignerBaseParameter = {
  id: string;
  name: string;
};

export type ExpDesignerNumberParameter = ExpDesignerBaseParameter & {
  type: 'number';
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
};

export type ExpDesignerRangeParameter = ExpDesignerBaseParameter & {
  type: 'range';
  value: RangeValue;
  unit: string;
};

export type ExpDesignerStringParameter = ExpDesignerBaseParameter & {
  type: 'string';
  value: string;
};

export type DropdownOptionsType = { label: string; value: string }[];

export type ExpDesignerDropdownParameter = ExpDesignerBaseParameter & {
  type: 'dropdown';
  value: string;
  options: DropdownOptionsType;
};

export type ExpDesignerMultipleDropdownParameter = ExpDesignerBaseParameter & {
  type: 'multipleDropdown';
  value: string[];
  options: DropdownOptionsType;
};

export type ExpDesignerTargetParameter = ExpDesignerBaseParameter & {
  type: 'targetDropdown';
  value: string;
};

export type ExpDesignerTargetDropdownGroupParameter = ExpDesignerBaseParameter & {
  type: 'targetDropdownGroup';
  value: string[];
};

export type ExpDesignerPositionParameter = ExpDesignerBaseParameter & {
  type: 'position';
  value: [number, number, number];
};

export type ExpDesignerRadioBtnParameter = ExpDesignerBaseParameter & {
  type: 'radioButton';
  value: string;
  options: string[];
};

export type ExpDesignerCheckboxParameter = ExpDesignerBaseParameter & {
  type: 'checkbox';
};

export type ExpDesignerCheckboxGroupParameter = ExpDesignerBaseParameter & {
  type: 'checkboxGroup';
  value: ExpDesignerCheckboxParameter[];
};

export type ExpDesignerGroupParameter = ExpDesignerBaseParameter & {
  type: 'group';
  value: ExpDesignerParam[];
};

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

export type ExpDesignerConfig = {
  [key: string]: ExpDesignerParam[];
};
