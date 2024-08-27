import { ISODateString } from 'next-auth';
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
  possibleValues?: number | number[];
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

type CumulativeAnalysisReportActivity = {
  '@type': 'Activity';
  'wasAssociatedWith': {
    '@type': 'AnalysisSoftwareSourceCode';
    '@id': string;
  };
};

type CumulativeAnalysisReportGeneration = {
  '@type': 'Generation';
  'activity': CumulativeAnalysisReportActivity;
};

export interface CumulativeAnalysisReport {
  '@id': string;
  type: 'CumulativeAnalysisReport';
  hasPart?: AnalysisReportLink[];
  generation: CumulativeAnalysisReportGeneration;
  wasGeneratedBy: { '@id': string };
  _createdAt: ISODateString;
}

export interface ExtendedCumAnalysisReport extends CumulativeAnalysisReport {
  multiAnalysis: MultipleSimulationCampaignAnalysis;
}

export interface MultipleSimulationCampaignAnalysis {
  '@id': string;
  status: string;
  _createdAt: ISODateString;
}
