'use client';

import { Suspense } from 'react';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import Detail from '@/components/explore-section/Detail';
import { DetailProps } from '@/types/explore-section/application';

const fields = [
  {
    field: 'description',
    className: 'col-span-3 row-span-2',
  },
  {
    field: 'brainRegion',
  },
  {
    field: 'subjectSpecies',
  },
  {
    field: 'reference',
  },
  {
    field: 'numberOfMeasurements',
  },
  {
    field: 'subjectAge',
    className: 'col-span-2',
  },
  {
    field: 'contributors',
    className: 'row-span-3',
  },
  {
    field: 'createdAt',
    className: 'col-span-2 row-span-3',
  },
  {
    field: 'mType',
  },
  {
    field: 'conditions',
    className: 'col-span-2',
  },
  {
    field: 'eType',
    className: 'col-span-3',
  },
  {
    field: 'neuronDensity',
  },
] as DetailProps[];

export default function NeuronDensityDetailPage() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={fields} />
    </Suspense>
  );
}
