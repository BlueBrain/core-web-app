import { Dispatch, SetStateAction } from 'react';

export type Status = 'initial' | 'selection';

export type DimensionBoxProps = {
  dimension?: Dimension;
  title?: string;
  dimensionOptions: { value: string; label: string }[];
  setAxis?: (value: string) => void;
  dismissFunc?: () => void;
  dismissible: boolean;
};

export type UnassignedDimensionBoxProps = {
  dimensionOptions: { value: string; label: string }[];
  setAxis?: (value: string) => void;
  status: Status;
  setStatus: Dispatch<SetStateAction<Status>>;
};

export type DimensionBoxEditFormProps = {
  dimension: Dimension;
  setEditMode: Dispatch<SetStateAction<boolean>>;
};

export type AssignedDimensionBoxProps = {
  dimension: Dimension;
};

export type DimensionTitleProps = {
  title?: string;
  dismissible: boolean;
  dismissFunc?: () => void;
  setStatus: Dispatch<SetStateAction<Status>>;
};

export type DimensionValue = {
  type: 'value';
  value: string;
};

export type DimensionRange = {
  type: 'range';
  minValue: string;
  maxValue: string;
};

export type Dimension = {
  id: string;
  value: DimensionValue | DimensionRange;
};
