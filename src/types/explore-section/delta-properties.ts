import { Id, IdWithLabel, IdWithType, IdWithValue, IdLabelWithType, Label, Type } from './common';
import { DateISOString } from '@/types/nexus/common';

export type Annotation = Type<string[]> & {
  hasBody: IdLabelWithType<string[]>;
  name: string;
  motivatedBy?: IdWithType;
  note?: string;
};

export type BrainLocation = Type & {
  atlasSpatialReferenceSystem?: IdWithType<string[]>;
  brainRegion: IdWithLabel;
  coordinatesInBrainAtlas?: Record<'valueX' | 'valueY' | 'valueZ', IdWithValue>;
  layer?: Label;
};

export type Contribution = Type<'Contribution'> & {
  agent: IdLabelWithType<string[]>;
};

export type Derivation = Type & {
  entity: IdWithType;
};

type GenerationSoftwareSourceCode = Type & {
  codeRepository: string;
  programmingLanguage: string;
  runtimePlatform: string;
  version: string;
};

type GenerationWasAssociatedWith = Type<string[]> & {
  description: string;
  name: string;
  softwareSourceCode: GenerationSoftwareSourceCode;
};

type GenerationActivity = Type & {
  endedAtTime: DateISOString;
  startedAtTime: DateISOString;
  wasAssociatedWith: GenerationWasAssociatedWith;
};

export type Generation = Type & {
  activity: GenerationActivity;
};

export type Image = Id & {
  about: string;
  repetition: number;
  stimulusType: Id;
};

export type SeriesStatistic = {
  statistic: string;
  unitCode: string;
  value: number;
};

export type Stimulus = Type & {
  stimulusType: IdWithLabel;
};

type SubjectAge = {
  maxValue?: number;
  minValue?: number;
  period: string;
  unitCode: string;
  value?: number;
};

type SubjectWeight = {
  unitCode: string;
  maxValue?: number;
  minValue?: number;
  value?: number;
};

// TODO: Verify whether "@type" actually ever exists
// on this property, and if not, then remove the
// "@type" condition in speciesDataFamily (atom), and
// set this to simply Id, not IdWithType.
export type Subject = IdWithType & {
  species: IdWithLabel;
  strain: Label;
  age?: SubjectAge;
  sex?: IdWithLabel;
  weight?: SubjectWeight;
};

export type Synapse = {
  postSynaptic: IdWithLabel;
  preSynaptic: IdWithLabel;
};
