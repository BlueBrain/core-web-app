import Aggregations from './es-aggs';
import { Experiment } from './es-experiment';
import { Simulation, SimulationCampaign } from './es-simulation-campaign';

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
