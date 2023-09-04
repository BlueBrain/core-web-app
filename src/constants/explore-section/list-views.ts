import { ESResponseRaw } from '@/types/explore-section/resources';

const BBP_ONTOLOGY_BASE_URL = 'https://bbp.epfl.ch/ontologies/core/bmo/';

export const BOUTON_DENSITY: string = `${BBP_ONTOLOGY_BASE_URL}ExperimentalBoutonDensity`;
export const NEURON_DENSITY: string = `${BBP_ONTOLOGY_BASE_URL}ExperimentalNeuronDensity`;
export const LAYER_THICKNESS: string = `${BBP_ONTOLOGY_BASE_URL}ExperimentalLayerThickness`;
export const ELECTRO_PHYSIOLOGY: string = `${BBP_ONTOLOGY_BASE_URL}ExperimentalTrace`;
export const SYNAPSE_PER_CONNECTION: string = `${BBP_ONTOLOGY_BASE_URL}ExperimentalSynapsesPerConnection`;

const NEURO_SHAPES_BASE_URL = 'https://neuroshapes.org/';

export const SIMULATION_CAMPAIGNS: string = `${NEURO_SHAPES_BASE_URL}SimulationCampaign`;
export const NEURON_MORPHOLOGY: string = `${NEURO_SHAPES_BASE_URL}ReconstructedNeuronMorphology`;

export type ExperimentDataTypeName =
  | typeof BOUTON_DENSITY
  | typeof NEURON_DENSITY
  | typeof LAYER_THICKNESS
  | typeof ELECTRO_PHYSIOLOGY
  | typeof SYNAPSE_PER_CONNECTION
  | typeof SIMULATION_CAMPAIGNS
  | typeof NEURON_MORPHOLOGY;

export type SelectedRowsProps = ESResponseRaw[];

export const DEFAULT_CHECKLIST_RENDER_LENGTH = 8;
export const PAGE_SIZE = 30;
export const PAGE_NUMBER = 1;
