import { SIMULATION_COLORS } from '@/constants/simulate/single-neuron';
import { SingleSynaptomeConfig } from '@/types/synaptome';

export const CREATE_SYNAPTOME_SUCCESS =
  'The Synaptome model has been successfully created. It may take up to 5 seconds for the new model to appear in the list of records under both the Explore and Build sections.';
export const CREATE_SYNAPTOME_SIMULATION_SUCCESS =
  'Simulation results have been successfully saved. It may take up to 5 seconds for the simulation to appear in the list of records under the Simulate section.';

export const CREATE_SYNAPTOME_FAIL =
  'Failed to process your synaptome addition request. Please review the form and try again or contact support.';
export const CREATE_SYNAPTOME_CONFIG_FAIL =
  'Failed to create the synaptome configuration file. Please review the form and try again or contact support.';

export const GENERATE_SYNAPSES_FAIL =
  'Failed to generate synapses configuration ($$). Please review the form and try again or contact support.';

export const CONFIG_FILE_NAME = 'synaptome_config.json';
export const DEFAULT_SYNAPSE_VALUE: SingleSynaptomeConfig = {
  id: '',
  name: '',
  target: undefined,
  type: undefined,
  distribution: 'formula',
  formula: undefined,
  seed: undefined,
  exclusion_rules: null,
  soma_synapse_count: 50,
  color: SIMULATION_COLORS[0],
};

export const sectionTargetMapping = {
  dend: 'Dendrite',
  soma: 'Soma',
  apic: 'Apical dendrite',
  basal: 'Basal dendrite',
  axon: 'Axon',
};

export type SectionTargetMappingKeys = keyof typeof sectionTargetMapping;

export const synapseTypeMapping = {
  110: 'Excitatory Synapses',
  10: 'Inhibitory Synapses',
};

export type SynapseTypeMappingKeys = keyof typeof synapseTypeMapping;
