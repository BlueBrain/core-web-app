import { ModelResource } from './explore-section/delta-model';

export const NEXUS_SYNAPTOME_TYPE = 'SingleNeuronSynaptome';
export const SYNAPTOME_OBJECT_OF_STUDY = {
  '@id': 'http://bbp.epfl.ch/neurosciencegraph/taxonomies/objectsofstudy/singlecells',
  '@type': 'nsg:ObjectOfStudy',
  label: 'Single Cell',
} as const;
type SynaptomeObjectOfStudy = typeof SYNAPTOME_OBJECT_OF_STUDY;

export type SingleSynaptomeConfig = {
  id: string;
  name: string;
  target: string | undefined;
  type: number | undefined;
  distribution: string | undefined;
  formula: string | undefined;
};

export type SynaptomeConfiguration = {
  name: string;
  description: string;
  seed: number;
  synapses: Array<SingleSynaptomeConfig>;
};

export type SingleNeuronSynaptomeResource = ModelResource & {
  objectOfStudy: SynaptomeObjectOfStudy;
  '@type': 'SingleNeuronSynaptome';
};
