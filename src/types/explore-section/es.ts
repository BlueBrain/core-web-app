import { IdWithLabel } from './common';
import Aggregations from './es-aggs';
import { ESHitSource } from './es-common';
import { Experiment } from './es-experiment';
import { BrainRegion } from './es-properties';
import { Simulation, SimulationCampaign } from './es-simulation-campaign';

type ElectrophysiologyOrMorphologyType = IdWithLabel & {
  identifier: string;
};

export type ESeModel = ESHitSource & {
  eType: ElectrophysiologyOrMorphologyType;
  mType: ElectrophysiologyOrMorphologyType;
  brainRegion: BrainRegion;
};

export type ExploreResource = Experiment | Simulation | SimulationCampaign | ESeModel;

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
