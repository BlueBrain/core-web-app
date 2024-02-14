import { ESHitSource } from './es-common';
import { SimulationStatus } from './common';
import { DateISOString } from '@/types/nexus/common';

type Attrs = {
  blue_config_template: string;
  circuit_config: string;
  path_prefix: string;
};

type Config = {
  '@id': string;
  identifier: string;
  name: string;
};

type Coords = Record<string, number[]>;

type Parameter = {
  attrs: Attrs;
  coords: Coords;
};

export type SimulationCampaign = ESHitSource & {
  config: Config;
  description: string;
  parameter: Parameter;
  status: string;
};

export type Simulation = ESHitSource & {
  dimensions: Record<string, number>;
  endedAt: DateISOString;
  name: string;
  parameter: Coords;
  startedAt: DateISOString;
  status: SimulationStatus;
};
