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
    field: 'meanstd',
  },
  {
    field: 'subjectAge',
  },
  {
    field: 'sem',
  },
  {
    field: 'weight',
  },
  {
    field: 'contributors',
    className: 'row-span-2',
  },
  {
    field: 'createdAt',
    className: 'row-span-2',
  },
  {
    field: 'license',
    className: 'row-span-2',
  },
  {
    field: 'numberOfMeasurements',
  },
  {
    field: 'conditions',
  },
  {
    field: 'reference',
  },
] as DetailProps[];

export default function SynapsePerConnectionDetailPage() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={fields} />
    </Suspense>
  );
}
