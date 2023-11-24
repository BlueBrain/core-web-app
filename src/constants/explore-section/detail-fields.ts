import { DetailProps } from '@/types/explore-section/application';

export const NEURON_MORPHOLOGY_FIELDS = [
  {
    field: 'description',
    className: 'col-span-3 row-span-2',
  },
  {
    field: 'mType',
  },
  {
    field: 'subjectSpecies',
  },
  {
    field: 'reference',
  },
  {
    field: 'brainRegion',
  },
  {
    field: 'conditions',
    className: 'col-span-2',
  },
  {
    field: 'contributors',
  },
  {
    field: 'createdAt',
  },
  {
    field: 'license',
  },
] as DetailProps[];