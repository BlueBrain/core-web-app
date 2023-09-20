import { Id, IdWithLabel, IdLabelWithType, Label, LabelWithType } from './common';

export type BrainRegion = IdWithLabel & {
  idLabel: string;
  identifier: string;
};

export type Contributor = IdLabelWithType<string[]> & {
  affiliation?: string; // ExperimentalTrace
  idLabel: string;
};

export type CoordinatesInBrainAtlas = {
  valueX: string;
  valueY: string;
  valueZ: string;
};

export type DerivationResource = LabelWithType<string | string[]> & {
  identifier: string;
};

export type EType = IdWithLabel & {
  idLabel: string;
  identifier: string;
};

export type FileDistribution = Label & {
  contentSize: number;
  contentUrl: string;
  encodingFormat: string;
};

export type Generation = {
  endedAt: Date;
  startedAt: Date;
};

export type Layer = Id & {
  idLabel: string;
  identifier: string;
  label: string;
};

export type LayerThickness = {
  label: string;
  nValue: number;
  unit: string;
  value: number;
};

export type License = Id & {
  identifier: string;
};

export type MType = IdWithLabel & {
  idLabel: string;
  identifier: string;
};

export type Statistic = {
  statistic: string;
  unit: string;
  value: number;
};

export type StimulusImage = Id & {
  about: string;
  identifier: string;
  repetition: number;
  stimulusType: string;
};

export type SubjectAge = Label & {
  period: string;
  unit: string;
  value: number;
};

export type SubjectSpecies = IdWithLabel & {
  identifier: string;
};

export type SubjectWeight = Label & {
  maxValue?: 200;
  minValue?: 180;
  unit?: string;
  value: number;
};
