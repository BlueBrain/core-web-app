'use client';

import { Suspense } from 'react';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import Detail, { DetailProps } from '@/components/explore-section/Detail';

const fields = [
  {
    field: 'description',
    className: 'col-span-3 row-span-2',
  },
  {
    field: 'brainRegion',
  },
  {
    field: 'meanstd',
  },
  {
    field: 'subjectSpecies',
  },
  {
    field: 'mType',
  },
  {
    field: 'sem',
  },
  {
    field: 'weight',
  },
  {
    field: 'contributors',
  },
  {
    field: 'createdAt',
  },
  {
    field: 'reference',
  },
  {
    field: 'numberOfMeasurements',
    className: 'col-span-2 col-start-5',
  },
] as DetailProps[];

export default function BoutonDensityDetails() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={fields} />
    </Suspense>
  );
}
