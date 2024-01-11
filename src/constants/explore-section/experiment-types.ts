import {
  BOUTON_DENSITY,
  ELECTRO_PHYSIOLOGY,
  ExperimentDataTypeName,
  LAYER_THICKNESS,
  NEURON_DENSITY,
  NEURON_MORPHOLOGY,
  SYNAPSE_PER_CONNECTION,
  SIMULATION_CAMPAIGNS,
} from '@/constants/explore-section/list-views';
import { DetailProps } from '@/types/explore-section/application';

export type ExperimentConfig = {
  title: string;
  name: string;
  columns: Array<string>;
  curated: boolean;
  cardViewFields?: DetailProps[];
};

export const INTERACTIVE_PATH = `/explore/interactive/`;
export const BASE_EXPLORE_PATH = `${INTERACTIVE_PATH}data/`;

export const SIMULATION_DATA_TYPES: {
  [x: ExperimentDataTypeName]: ExperimentConfig;
} = {
  [SIMULATION_CAMPAIGNS]: {
    title: 'Simulation campaigns',
    name: 'simulation-campaigns',
    columns: ['simCampName', 'brainConfiguration', 'createdAt'],
    curated: false,
  },
};

export const EXPERIMENT_DATA_TYPES: {
  [x: ExperimentDataTypeName]: ExperimentConfig;
} = {
  [NEURON_MORPHOLOGY]: {
    title: 'Morphology',
    name: 'morphology',
    columns: [
      'preview',
      'brainRegion',
      'mType',
      'name',
      'subjectSpecies',
      'contributors',
      'createdAt',
    ],
    curated: true,
    cardViewFields: [
      {
        field: 'name',
        className: 'col-span-2',
      },
      {
        field: 'neuronMorphologyWidth',
        className: 'col-span-2',
      },
      {
        field: 'neuronMorphologyLength',
        className: 'col-span-2',
      },
      {
        field: 'neuronMorphologyDepth',
        className: 'col-span-2',
      },
      {
        field: 'axonTotalLength',
        className: 'col-span-2',
      },
      {
        field: 'axonMaxBranchOrder',
        className: 'col-span-2',
      },
      {
        field: 'axonArborAsymmetryIndex',
        className: 'col-span-2',
      },
      {
        field: 'basalDendriticTotalLength',
        className: 'col-span-2',
      },
      {
        field: 'basalDendriteMaxBranchOrder',
        className: 'col-span-2',
      },
      {
        field: 'basalArborAsymmetryIndex',
        className: 'col-span-2',
      },
      {
        field: 'apicalDendriticTotalLength',
        className: 'col-span-2',
      },
      {
        field: 'apicalDendtriteMaxBranchOrder',
        className: 'col-span-2',
      },
      {
        field: 'somaDiameter',
        className: 'col-span-2',
      },
      {
        field: 'apicalArborAsymmetryIndex',
        className: 'col-span-2',
      },
      {
        field: 'brainRegion',
        className: 'col-span-2',
      },
      {
        field: 'mType',
        className: 'col-span-2',
      },
      {
        field: 'subjectSpecies',
        className: 'col-span-2',
      },
      {
        field: 'contributors',
        className: 'col-span-2',
      },
      {
        field: 'createdAt',
        className: 'col-span-2',
      },
    ],
  },
  [ELECTRO_PHYSIOLOGY]: {
    title: 'Electrophysiology',
    name: 'electrophysiology',
    columns: ['brainRegion', 'eType', 'name', 'subjectSpecies', 'contributors', 'createdAt'],
    curated: true,
  },
  [NEURON_DENSITY]: {
    title: 'Neuron density',
    name: 'neuron-density',
    columns: [
      'brainRegion',
      'mType',
      'eType',
      'neuronDensity',
      'numberOfMeasurements',
      'name',
      'subjectSpecies',
      'subjectAge',
      'contributors',
      'createdAt',
    ],
    curated: false,
  },
  [BOUTON_DENSITY]: {
    title: 'Bouton density',
    name: 'bouton-density',
    columns: [
      'brainRegion',
      'mType',
      'meanstd',
      'sem',
      'numberOfMeasurements',
      'subjectSpecies',
      'contributors',
      'createdAt',
    ],
    curated: false,
  },
  [LAYER_THICKNESS]: {
    title: 'Layer thickness',
    name: 'layer-thickness',
    columns: [
      'brainRegion',
      'layer',
      'layerThickness',
      'subjectSpecies',
      'contributors',
      'createdAt',
    ],
    curated: false,
  },
  [SYNAPSE_PER_CONNECTION]: {
    title: 'Synapse per connection',
    name: 'synapse-per-connection',
    columns: [
      'preSynapticBrainRegion',
      'postSynapticBrainRegion',
      'preSynapticCellType',
      'postSynapticCellType',
      'layer',
      'layerThickness',
      'subjectSpecies',
      'contributors',
      'createdAt',
    ],
    curated: false,
  },
};
