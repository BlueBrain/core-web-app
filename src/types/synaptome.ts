export const NEXUS_SYNAPTOME_TYPE = 'SingleNeuronSynaptome';
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
