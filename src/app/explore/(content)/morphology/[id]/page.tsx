'use client';

import { Suspense } from 'react';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import Detail, { DetailProps } from '@/components/explore-section/Detail';
import MorphoViewerContainer from '@/components/explore-section/MorphoViewerContainer';
import { DeltaResource } from '@/types/explore-section';
import usePathname from '@/hooks/pathname';
import useDetailPage from '@/hooks/useDetailPage';
import Contributors from '@/components/explore-section/Contributors';
import License from '@/components/explore-section/License';
import Species from '@/components/explore-section/Species';

const fields = [
  {
    title: 'Description',
    field: ({ description }) => description,
    className: 'col-span-3 row-span-2',
  },
  {
    title: 'M-Type',
    field: ({ mType }) => mType,
  },
  {
    title: 'Species',
    field: <Species />,
  },
  {
    title: 'Reference',
  },
  {
    title: 'Brain Region',
    field: ({ brainRegion }) => brainRegion,
  },
  {
    title: 'Conditions',
    className: 'col-span-2',
  },
  {
    title: ({ contributors }) => (contributors?.length === 1 ? 'Contributor' : 'Contributors'),
    field: <Contributors />,
  },
  {
    title: 'Created On',
    field: ({ creationDate }) => creationDate,
  },
  {
    title: 'License',
    field: <License />,
  },
] as DetailProps[];

export default function MorphologyDetailPage() {
  useDetailPage(usePathname());

  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={fields} links={[{ url: '/explore/morphology' }]}>
        {(detail: DeltaResource) => <MorphoViewerContainer resource={detail} />}
      </Detail>
    </Suspense>
  );
}
