'use client';

import { Suspense } from 'react';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import Detail from '@/components/explore-section/Detail';
import { DeltaResource } from '@/types/explore-section/resources';
import EphysViewerContainer from '@/components/explore-section/EphysViewerContainer';
import { DetailProps } from '@/types/explore-section/application';

const fields = [
  {
    field: 'description',
    className: 'col-span-3 row-span-2',
  },
  {
    field: 'eType',
    className: 'row-span-2',
  },
  {
    field: 'subjectSpecies',
    className: 'row-span-2',
  },
  {
    field: 'brainRegion',
    className: 'row-span-2',
  },
  {
    field: 'contributors',
    className: 'col-span-3',
  },
  {
    field: 'createdAt',
  },
] as DetailProps[];

export default function EphysDetailPage() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={fields}>
        {(detail: DeltaResource) => <EphysViewerContainer resource={detail} />}
      </Detail>
    </Suspense>
  );
}
