type ExpDesignerParameter = {
  id: string;
  name: string;
  unit: string | null;
};

export type ExpDesignerNumberParameter = ExpDesignerParameter & {
  type: 'number';
  value: string;
};
