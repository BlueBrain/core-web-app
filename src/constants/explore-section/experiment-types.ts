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

type ExperimentType = {
  cardViewFields?: DetailProps[];
};

export const EXPERIMENT_TYPES: Record<ExperimentDataTypeName, ExperimentType> = {
  [NEURON_MORPHOLOGY]: {
    cardViewFields: [
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
  },
};

export const EXPERIMENT_TYPE_DETAILS: {
  id: ExperimentDataTypeName;
  title: string;
  route: string;
}[] = [
  {
    title: 'Bouton density',
    id: BOUTON_DENSITY,
    route: '/explore/interactive/bouton-density',
  },
  {
    title: 'Morphologies',
    id: NEURON_MORPHOLOGY,
    route: '/explore/interactive/morphology',
  },
  {
    title: 'Electrophysiology',
    id: ELECTRO_PHYSIOLOGY,
    route: '/explore/interactive/electrophysiology',
  },
  {
    title: 'Neuron density',
    id: NEURON_DENSITY,
    route: '/explore/interactive/neuron-density',
  },
  {
    title: 'Layer thickness',
    id: LAYER_THICKNESS,
    route: '/explore/interactive/layer-thickness',
  },
  {
    title: 'Synapse per connection',
    id: SYNAPSE_PER_CONNECTION,
    route: '/explore/interactive/synapse-per-connection',
  },
];
