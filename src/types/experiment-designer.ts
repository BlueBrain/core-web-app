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
