import { Dispatch, SetStateAction } from 'react';
import { Dimension } from '@/types/explore-section';

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

export type AssignedDimensionBoxProps = {
  dimension: Dimension;
  dismissible: boolean;
  dismissFunc?: () => void;
  hovered: boolean;
};

export type DimensionTitleProps = {
  title?: string;
  dismissible: boolean;
  dismissFunc?: () => void;
  setStatus: Dispatch<SetStateAction<Status>>;
};
