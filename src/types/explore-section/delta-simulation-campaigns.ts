import { IdWithType, Type } from './delta';
import { DateISOString, EntityResource } from '@/types/nexus/common';

export type ParameterCoords = Record<string, number | number[]>;

type ContentSize = {
  unitCode: 'bytes';
  value: 861;
};

type Digest = {
  algorithm: string;
  value: string;
};

type ParameterAttrs = {
  blue_config_template: string;
  circuit_config: string;
  path_prefix: string;
};

type Parameter = {
  attrs?: ParameterAttrs;
  coords: ParameterCoords;
};

export type Simulation = EntityResource & {
  endedAtTime: DateISOString;
  log_url: string;
  name: string;
  parameter: Parameter;
  startedAtTime: DateISOString;
  status: string;
  wasGeneratedBy: IdWithType;
};

export type SimCampSims = Type & {
  contentSize: ContentSize;
  contentUrl: string;
  digest: Digest;
  encodingFormat: string;
};

export type SimulationCampaign = EntityResource & {
  description: string;
  brainConfiguration: string;
  name: string;
  parameter: Parameter;
  simulations: SimCampSims;
  wasGeneratedBy: IdWithType;
};

export type SimulationCampaignExecution = EntityResource & {
  endedAtTime: string;
  generated: IdWithType;
  startedAtTime: string;
  status: string;
  used: IdWithType;
  used_config: IdWithType;
  used_rev: number;
  wasInfluencedBy: IdWithType;
};
