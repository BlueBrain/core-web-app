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

export type ExpDesignerParam =
  | ExpDesignerNumberParameter
  | ExpDesignerDropdownParameter
  | ExpDesignerRangeParameter
  | ExpDesignerStringParameter
  | ExpDesignerRegionParameter;

export type ExpDesignerConfig = {
  [key: string]: ExpDesignerParam[];
};
