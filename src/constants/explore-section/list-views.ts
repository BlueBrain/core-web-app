import { neuroShapesBaseUrl, ontologyBaseUrl } from '@/config';

export const BOUTON_DENSITY: string = `${ontologyBaseUrl}/ExperimentalBoutonDensity`;
export const NEURON_DENSITY: string = `${ontologyBaseUrl}/ExperimentalNeuronDensity`;
export const ELECTRO_PHYSIOLOGY: string = `${ontologyBaseUrl}/ExperimentalTrace`;
export const SYNAPSE_PER_CONNECTION: string = `${ontologyBaseUrl}/ExperimentalSynapsesPerConnection`;

export const SIMULATION_CAMPAIGNS: string = `${neuroShapesBaseUrl}/SimulationCampaign`;
export const NEURON_MORPHOLOGY: string = `${neuroShapesBaseUrl}/ReconstructedNeuronMorphology`;

export type ExperimentDataTypeName =
  | typeof BOUTON_DENSITY
  | typeof NEURON_DENSITY
  | typeof ELECTRO_PHYSIOLOGY
  | typeof SYNAPSE_PER_CONNECTION
  | typeof SIMULATION_CAMPAIGNS
  | typeof NEURON_MORPHOLOGY;

export const DEFAULT_CHECKLIST_RENDER_LENGTH = 8;
export const PAGE_SIZE = 30;
export const PAGE_NUMBER = 1;
