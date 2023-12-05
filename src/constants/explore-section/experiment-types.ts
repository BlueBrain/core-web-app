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

const BASE_EXPLORE_PATH = `/explore/interactive/data`;

type ExperimentType = {
  cardViewFields?: { [key: string]: DetailProps[] };
  resourceBasePath: string;
};

type TypesOrder = {
  [x: ExperimentDataTypeName]: Array<string>;
};

export const EXPERIMENTAL_DATA_FIELDS_ORDER: TypesOrder = {
  [NEURON_MORPHOLOGY]: [
    'preview',
    'brainRegion',
    'mType',
    'name',
    'subjectSpecies',
    'contributors',
    'createdAt',
    'reference',
  ],
  [ELECTRO_PHYSIOLOGY]: [
    'brainRegion',
    'eType',
    'name',
    'conditions',
    'subjectSpecies',
    'contributors',
    'createdAt',
    'reference',
  ],
  [NEURON_DENSITY]: [
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
  [BOUTON_DENSITY]: [
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
  [LAYER_THICKNESS]: [
    'brainRegion',
    'layer',
    'layerThickness',
    'conditions',
    'subjectSpecies',
    'contributors',
    'createdAt',
    'reference',
  ],
  [SYNAPSE_PER_CONNECTION]: [
    'brainRegion',
    'layer',
    'layerThickness',
    'conditions',
    'subjectSpecies',
    'contributors',
    'createdAt',
    'reference',
  ],
};

export const EXPERIMENT_TYPES: Record<ExperimentDataTypeName, ExperimentType> = {
  [NEURON_MORPHOLOGY]: {
    resourceBasePath: `${BASE_EXPLORE_PATH}/morphology`,
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
