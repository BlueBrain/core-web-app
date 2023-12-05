import {
  BOUTON_DENSITY,
  ELECTRO_PHYSIOLOGY,
  ExperimentDataTypeName,
  LAYER_THICKNESS,
  NEURON_DENSITY,
  NEURON_MORPHOLOGY,
  SYNAPSE_PER_CONNECTION,
} from '@/constants/explore-section/list-views';
import { DetailProps } from '@/types/explore-section/application';

type ExperimentTypes = {
  [x: ExperimentDataTypeName]: {
    title: string;
    name: string;
    columns: Array<string>;
    cardViewFields?: { [key: string]: DetailProps[] };
  };
};

export const EXPERIMENT_DATA_TYPES: ExperimentTypes = {
  [NEURON_MORPHOLOGY]: {
    title: 'Morphologies',
    name: 'morphology',
    columns: [
      'preview',
      'brainRegion',
      'mType',
      'name',
      'subjectSpecies',
      'contributors',
      'createdAt',
      'reference',
    ],
    cardViewFields: {
      morphometrics: [
        {
          field: 'length',
          className: 'col-span-2',
        },
        {
          field: 'maximumLength',
          className: 'col-span-2',
        },
        {
          field: 'totalLength',
          className: 'col-span-2',
        },
        {
          field: 'dendriteStemming',
          className: 'col-span-2',
        },
        {
          field: 'axon',
          className: 'col-span-2',
        },
        {
          field: 'bifurcations',
          className: 'col-span-2',
        },
      ],
      metadata: [
        {
          field: 'brainRegion',
          className: 'col-span-2',
        },
        {
          field: 'mType',
          className: 'col-span-2',
        },
        {
          field: 'name',
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
      ], // these fields are duplicates of the fields found in the typToColumns method. We should in the future reorganize our constants since they are starting to overlap in places.
    },
  },
  [ELECTRO_PHYSIOLOGY]: {
    title: 'Electrophysiology',
    name: 'electrophysiology',
    columns: [
      'brainRegion',
      'eType',
      'name',
      'conditions',
      'subjectSpecies',
      'contributors',
      'createdAt',
      'reference',
    ],
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
      'conditions',
      'subjectSpecies',
      'contributors',
      'createdAt',
      'reference',
    ],
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
      'reference',
    ],
  },
  [LAYER_THICKNESS]: {
    title: 'Layer thickness',
    name: 'layer-thickness',
    columns: [
      'brainRegion',
      'layer',
      'layerThickness',
      'conditions',
      'subjectSpecies',
      'contributors',
      'createdAt',
      'reference',
    ],
  },
  [SYNAPSE_PER_CONNECTION]: {
    title: 'Synapse per connection',
    name: 'synapse-per-connection',
    columns: [
      'brainRegion',
      'layer',
      'layerThickness',
      'conditions',
      'subjectSpecies',
      'contributors',
      'createdAt',
      'reference',
    ],
  },
};

export type ExperimentDetail = {
  id: ExperimentDataTypeName;
  title: string;
  name: string;
};

export const EXPERIMENT_TYPE_DETAILS: ExperimentDetail[] = [
  {
    title: 'Bouton density',
    id: BOUTON_DENSITY,
    name: 'bouton-density',
  },
  {
    title: 'Morphologies',
    id: NEURON_MORPHOLOGY,
    name: 'morphology',
  },
  {
    title: 'Electrophysiology',
    id: ELECTRO_PHYSIOLOGY,
    name: 'electrophysiology',
  },
  {
    title: 'Neuron density',
    id: NEURON_DENSITY,
    name: 'neuron-density',
  },
  {
    title: 'Layer thickness',
    id: LAYER_THICKNESS,
    name: 'layer-thickness',
  },
  {
    title: 'Synapse per connection',
    id: SYNAPSE_PER_CONNECTION,
    name: 'synapse-per-connection',
  },
];
