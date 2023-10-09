import { ExperimentDataTypeName, NEURON_MORPHOLOGY } from '@/constants/explore-section/list-views';
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
