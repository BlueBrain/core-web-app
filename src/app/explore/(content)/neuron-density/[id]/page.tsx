'use client';

import { Suspense } from 'react';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import Detail, { DetailProps } from '@/components/explore-section/Detail';
import useDetailPage from '@/hooks/useDetailPage';
import usePathname from '@/hooks/pathname';

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
  useDetailPage(usePathname());
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={fields} />
    </Suspense>
  );
}
