import { ExperimentDataTypeName, NEURON_MORPHOLOGY } from '@/constants/explore-section/list-views';
import { DetailProps } from '@/types/explore-section/application';

export type DetailFieldsConfigProps = {
  [key: ExperimentDataTypeName]: DetailProps[];
};

export const DETAIL_FIELDS_CONFIG: DetailFieldsConfigProps = {
  [NEURON_MORPHOLOGY]: [
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
  ],
};
