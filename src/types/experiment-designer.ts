type RangeValue = {
  min: string;
  max: string;
  start: string;
  end: string;
  step: string;
};

type ExpDesignerBaseParameter = {
  id: string;
  name: string;
};

export type ExpDesignerNumberParameter = ExpDesignerBaseParameter & {
  type: 'number';
  value: string;
  unit: string | null;
};

export type ExpDesignerRangeParameter = ExpDesignerBaseParameter & {
  type: 'range';
  value: RangeValue;
};

export type ExpDesignerStringParameter = ExpDesignerBaseParameter & {
  type: 'string';
  value: string;
};

export type ExpDesignerDropdownParameter = ExpDesignerBaseParameter & {
  type: 'dropdown';
  value: string;
  options: { label: string; value: string }[];
};

export type ExpDesignerRegionParameter = ExpDesignerBaseParameter & {
  type: 'regionDropdown';
  value: string;
};

export type ExpDesignerPositionParameter = ExpDesignerBaseParameter & {
  type: 'position';
  value: [number, number, number];
};

export type ExpDesignerRadioBtnParameter = ExpDesignerBaseParameter & {
  type: 'radioButton';
  value: string[];
};

export type ExpDesignerRegionDropdownGroupParameter = ExpDesignerBaseParameter & {
  type: 'regionDropdownGroup';
  value: ExpDesignerRegionParameter[];
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
  | ExpDesignerRangeParameter
  | ExpDesignerStringParameter
  | ExpDesignerRegionParameter
  | ExpDesignerPositionParameter
  | ExpDesignerRadioBtnParameter
  | ExpDesignerRegionDropdownGroupParameter
  | ExpDesignerCheckboxParameter
  | ExpDesignerCheckboxGroupParameter
  | ExpDesignerGroupParameter;

export type ExpDesignerListParam = {
  id: string;
  value: ExpDesignerParam[];
};

export type ExpDesignerConfig = {
  [key: string]: ExpDesignerParam[] | ExpDesignerListParam[];
};
