import Aggregations from './es-aggs';
import { DateISOString } from '@/types/nexus/common';

type Id = {
  '@id': string;
};

type Type<T = string> = {
  '@type': T;
};

type IdWithType<T = string> = Id & Type<T>;

type Attrs = {
  blue_config_template: string;
  circuit_config: string;
  path_prefix: string;
};

type BrainRegion = Id & {
  idLabel: string;
  identifier: string;
  label: string;
};

type Config = Id & {
  identifier: string;
  name: string;
};

type Contributor = IdWithType<string[]> & {
  affiliation?: string; // ExperimentalTrace
  idLabel: string;
  label: string;
};

type CoordinatesInBrainAtlas = {
  valueX: string;
  valueY: string;
  valueZ: string;
};

type Coords = Record<string, number[]>;

type DerivationResource = Type<string | string[]> & {
  identifier: string;
  label: string;
};

type EType = Id & {
  idLabel: string;
  identifier: string;
  label: string;
};

type FileDistribution = {
  contentSize: number;
  contentUrl: string;
  encodingFormat: string;
  label: string;
};

type Generation = {
  endedAt: Date;
  startedAt: Date;
};

type Image = StimulusImage[];

type Layer = Id & {
  idLabel: string;
  identifier: string;
  label: string;
};

type LayerThickness = {
  label: string;
  nValue: number;
  unit: string;
  value: number;
};

type License = Id & {
  identifier: string;
};

type MType = Id & {
  idLabel: string;
  identifier: string;
  label: string;
};

type Parameter = {
  attrs: Attrs;
  coords: Coords;
};

type Project = Id & {
  identifier: string;
  label: string;
};

type Statistic = {
  statistic: string;
  unit: string;
  value: number;
};

type StimulusImage = Id & {
  about: string;
  identifier: string;
  repetition: number;
  stimulusType: string;
};

type SubjectAge = {
  label: string;
  period: string;
  unit: string;
  value: number;
};

type SubjectSpecies = Id & {
  identifier: string;
  label: string;
};

type SubjectWeight = {
  label: string;
  maxValue?: 200;
  minValue?: 180;
  unit?: string;
  value: number;
};

type ESHitSource = IdWithType<string[]> & {
  createdAt: Date;
  createdBy: string;
  deprecated: boolean;
  name: string;
  project: Project;
  updatedAt: Date;
  updatedBy: string;
  _self: string;
};

type ExperimentProps = ESHitSource & {
  brainRegion: BrainRegion;
  contributors: Contributor[];
  subjectSpecies: SubjectSpecies;
};

type ExperimentalBoutonDensity = ExperimentProps & {
  mType: MType;
  series: Statistic[]; // Not on ExperimentalTrace
  subjectWeight: SubjectWeight;
};

export type ExperimentalLayerThickness = ExperimentProps & {
  derivation: DerivationResource;
  description: string;
  layer: Layer[];
  layerThickness: LayerThickness;
  series: Statistic[];
};

type ExperimentalNeuronDensity = ExperimentProps & {
  mType: MType;
  series: Statistic[];
};

type ExperimentalSynapsesPerConnection = ExperimentProps & {
  description: string;
  series: Statistic[];
  subjectWeight: SubjectWeight;
};

export type ExperimentalTrace = ExperimentProps & {
  description: string;
  distribution: FileDistribution[];
  eType: EType;
  image: Image;
  license: License;
  subjectAge: SubjectAge;
  subjectWeight: SubjectWeight;
};

export type ReconstructedNeuronMorphology = ExperimentProps & {
  coordinatesInBrainAtlas: CoordinatesInBrainAtlas;
  derivation: DerivationResource;
  description: string;
  distribution: FileDistribution[];
  generation: Generation;
  license: License;
};

export type Experiment =
  | ExperimentalBoutonDensity
  | ExperimentalLayerThickness
  | ExperimentalNeuronDensity
  | ExperimentalSynapsesPerConnection
  | ExperimentalTrace
  | ReconstructedNeuronMorphology;

export type WithStatistic = Exclude<Experiment, ExperimentalTrace | ReconstructedNeuronMorphology>;

type SimulationCampaign = ESHitSource & {
  config: Config;
  description: string;
  parameter: Parameter;
  status: string;
};

export type Simulation = ESHitSource & {
  name: string;
  endedAt: DateISOString;
  parameter: Coords;
  project: Project; // TODO: Possibly no longer necessary?
  startedAt: DateISOString;
  status: string;
};

export type ExploreResource = Experiment | Simulation | SimulationCampaign;

export type ExploreESHit = {
  sort: number[];
  _id: string;
  _index: string;
  _source: ExploreResource;
};

export type ExploreESResponse = {
  aggregations: Aggregations;
  hits: {
    hits: ExploreESHit[];
    total: {
      relation: string;
      value: number;
    };
  };
};

export type FlattenedExploreESResponse = {
  aggs: ExploreESResponse['aggregations'];
  hits: ExploreESResponse['hits']['hits'];
  total: ExploreESResponse['hits']['total'];
};
