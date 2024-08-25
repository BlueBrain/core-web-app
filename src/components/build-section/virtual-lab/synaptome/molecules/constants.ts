import { SingleSynaptomeConfig } from '@/types/synaptome';

export const CREATE_SYNAPTOME_SUCCESS = 'The synaptome has been successfully created';
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
  distribution: undefined,
  formula: undefined,
  seed: undefined,
  exclusion_rules: null,
};