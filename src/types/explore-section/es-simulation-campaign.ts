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

export type Coords = Record<string, number | number[]>; // TODO: Should it really be number | number[]?

type Parameter = {
  attrs: Attrs;
  coords: Coords;
};

export type SimulationCampaign = ESHitSource & {
  config: Config;
  description: string;
  parameter: Parameter;
  status: SimulationStatus;
};

export type Simulation = ESHitSource & {
  endedAt: DateISOString;
  name: string;
  parameter: Parameter;
  startedAt: DateISOString;
  status: SimulationStatus;
};

// This represents the type that is created
// by the simulationsFamily atom.
export type FormattedSimulation = {
  title: string;
  completedAt: DateISOString;
  dimensions: Coords;
  id: string;
  project: string;
  startedAt: DateISOString;
  status: SimulationStatus;
};
