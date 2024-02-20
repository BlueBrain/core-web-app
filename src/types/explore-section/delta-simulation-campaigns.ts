import { IdWithType, Type, SimulationStatus } from './common';
import { DateISOString, EntityResource } from '@/types/nexus/common';

export type ParameterCoords = Record<string, number[]>;

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
  completedAt: DateISOString; // TODO: Check: Does this field really exist? Is it leftover from a previous type of Simulation?
  dimensions: Record<string, number>; // TODO: Verify where this prop comes from.
  endedAt: DateISOString; // TODO: Check: Does this field really exist? Is it leftover from a previous type of Simulation?
  endedAtTime?: DateISOString;
  log_url: string;
  name: string;
  parameter: Parameter;
  startedAtTime?: DateISOString;
  startedAt: DateISOString; // TODO: Check: Does this field really exist? Is it leftover from a previous type of Simulation?
  status: SimulationStatus;
  title: string; // TODO: Verify where this prop comes from.
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
  status: SimulationStatus;
  used: IdWithType;
  used_config: IdWithType;
  used_rev: number;
  wasInfluencedBy: IdWithType;
};

export type SimulationResource = SimulationCampaign | Simulation;
