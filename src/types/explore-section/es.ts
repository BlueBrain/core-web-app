import { IdWithLabel } from './common';
import Aggregations from './es-aggs';
import { ESHitSource } from './es-common';
import { Experiment } from './es-experiment';
import { BrainRegion } from './es-properties';
import { Simulation, SimulationCampaign } from './es-simulation-campaign';

type ElectrophysiologyOrMorphologyType = IdWithLabel & {
  identifier: string;
};

type EModelAnalysisImage = {
  '@id': string;
  about?: string;
  identifier?: string;
};

export type ESeModel = ESHitSource & {
  eType: ElectrophysiologyOrMorphologyType;
  mType: ElectrophysiologyOrMorphologyType;
  brainRegion: BrainRegion;
  image?: EModelAnalysisImage[] | EModelAnalysisImage;
};

export type ESmeModel = ESeModel & {
  memodel?: {
    emodelResource: {
      '@id': string;
      name: string;
    };
    neuronMorphology: {
      '@id': string;
      name: string;
    };
    validated: boolean;
  };
};

// TODO: Use the same type here that @Bilal adds in his PR
export type MEModelSynaptome = ESHitSource & {
  synapses: { id: string }[];
};

export type ExploreResource =
  | Experiment
  | Simulation
  | SimulationCampaign
  | ESeModel
  | MEModelSynaptome;

export type ExploreESHit<H extends ExploreResource> = {
  sort: number[];
  _id: string;
  _index: string;
  _source: H;
};

export type ExploreESResponse<H extends ExploreResource> = {
  aggregations: Aggregations;
  hits: {
    hits: ExploreESHit<H>[];
    total: {
      relation: string;
      value: number;
    };
  };
};

export type FlattenedExploreESResponse<H extends ExploreResource> = {
  aggs: ExploreESResponse<H>['aggregations'];
  hits: ExploreESResponse<H>['hits']['hits'];
  total: ExploreESResponse<H>['hits']['total'];
};
