import { ModelResource } from './explore-section/delta-model';

export const NEXUS_SYNAPTOME_TYPE = 'SingleNeuronSynaptome';
export const SYNAPTOME_OBJECT_OF_STUDY = {
  '@id': 'http://bbp.epfl.ch/neurosciencegraph/taxonomies/objectsofstudy/singlecells',
  '@type': 'nsg:ObjectOfStudy',
  label: 'Single Cell',
} as const;
type SynaptomeObjectOfStudy = typeof SYNAPTOME_OBJECT_OF_STUDY;

export type SynaptomeConfigDistribution = {
  synapses: SingleSynaptomeConfig[];
  meModelSelf: string;
};

type ExclusionRule = {
  id: string;
  distance_soma_gte: number | undefined;
  distance_soma_lte: number | undefined;
};

export type SingleSynaptomeConfig = {
  id: string;
  name: string;
  target: string | undefined;
  type: number | undefined;
  distribution: string | undefined;
  formula: string | undefined;
  seed: number | undefined;
  exclusion_rules: Array<ExclusionRule> | null;
};

export type SynaptomeModelConfiguration = {
  name: string;
  description: string;
  seed: number;
  modelUrl: string;
  synapses: Array<SingleSynaptomeConfig>;
};

export type SingleNeuronSynaptomeResource = ModelResource & {
  objectOfStudy: SynaptomeObjectOfStudy;
  '@type': 'SingleNeuronSynaptome';
};
