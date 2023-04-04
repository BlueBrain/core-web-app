type RangeValue = {
  min: string;
  max: string;
  start: string;
  end: string;
  step: string;
};

type ExpDesignerParameter = {
  id: string;
  name: string;
};

export type ExpDesignerNumberParameter = ExpDesignerParameter & {
  type: 'number';
  value: string;
  unit: string | null;
};

export type ExpDesignerRangeParameter = ExpDesignerParameter & {
  type: 'range';
  value: RangeValue;
};

export type ExpDesignerStringParameter = ExpDesignerParameter & {
  type: 'string';
  value: string;
};

export type ExpDesignerDropdownParameter = ExpDesignerParameter & {
  type: 'dropdown';
  value: string;
  options: { label: string; value: string }[];
};

export type ExpDesignerConfig = {
  setup: Array<
    | ExpDesignerNumberParameter
    | ExpDesignerDropdownParameter
    | ExpDesignerRangeParameter
    | ExpDesignerStringParameter
  >;
};
