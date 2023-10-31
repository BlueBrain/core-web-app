'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import { DetailProps } from '@/types/explore-section/application';
import MorphoViewerContainer from '@/components/explore-section/MorphoViewerContainer';
import { DeltaResource } from '@/types/explore-section/resources';

const fields = [
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

// dynamic importation due to hydration issue in morphology 3d component
const Detail = dynamic(() => import('@/components/explore-section/Detail'), { ssr: false });

export default function MorphologyDetailPage() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={fields}>
        {(detail: DeltaResource) => <MorphoViewerContainer resource={detail} />}
      </Detail>
    </Suspense>
  );
}
