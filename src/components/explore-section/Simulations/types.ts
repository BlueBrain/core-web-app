import { Dispatch, SetStateAction } from 'react';

export type Status = 'initial' | 'selection';

export type DimensionBoxProps = {
  dimension?: Dimension;
  title?: string;
  dimensionOptions: { value: string; label: string }[];
  setAxis?: (value: string) => void;
  dismissFunc?: () => void;
  dismissible: boolean;
  isAxis: boolean;
  possibleValues?: number[];
};

export type UnassignedDimensionBoxProps = {
  dimensionOptions: { value: string; label: string }[];
  setAxis?: (value: string) => void;
  status: Status;
  setStatus: Dispatch<SetStateAction<Status>>;
};

export type AxisDimensionBoxEditFormProps = {
  dimension: Dimension;
  setEditMode: Dispatch<SetStateAction<boolean>>;
};

export type DimensionBoxEditFormProps = {
  dimension: Dimension;
  setEditMode: Dispatch<SetStateAction<boolean>>;
  isAxis: boolean;
};

export type OtherDimensionBoxEditFormProps = {
  dimension: Dimension;
  setEditMode: Dispatch<SetStateAction<boolean>>;
};

export type AssignedDimensionBoxProps = {
  dimension: Dimension;
  isAxis: boolean;
};

export type DimensionTitleProps = {
  title?: string;
  dismissible: boolean;
  dismissFunc?: () => void;
  setStatus: Dispatch<SetStateAction<Status>>;
  possibleValues?: number[];
};

export type DimensionValue = {
  type: 'value';
  value: string;
};

export type DimensionRange = {
  type: 'range';
  minValue: string;
  maxValue: string;
  step: string;
};

export type Dimension = {
  id: string;
  value: DimensionValue | DimensionRange;
};

export interface AnalysisReportLink {
  '@id': string;
  '@type': 'AnalysisReport';
}

interface ContributionLink {
  '@id': string;
  '@type': 'Contribution';
}

export interface Contribution extends ContributionLink {
  agent: { '@id': string; type: 'AnalysisSoftwareSourceCode' };
}
export interface CumulativeAnalysisReport {
  '@id': string;
  type: 'CumulativeAnalysisReport';
  hasPart?: AnalysisReportLink[];
  contribution: ContributionLink;
  _createdAt: string;
}

export interface CumulativeAnalysisReportWContrib extends CumulativeAnalysisReport {
  contribution: Contribution;
}
