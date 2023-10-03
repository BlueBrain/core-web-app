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
    field: 'subjectSpecies',
  },
  {
    field: 'reference',
  },
  {
    field: 'layer',
  },
  {
    field: 'subjectAge',
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
  {
    field: 'layerThickness',
  },
  {
    field: 'conditions',
  },
] as DetailProps[];

export default function LayerThicknessDetailPage() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={fields} />
    </Suspense>
  );
}
