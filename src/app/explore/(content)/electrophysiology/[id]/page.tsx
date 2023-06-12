'use client';

import { Suspense } from 'react';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import Detail, { DetailProps } from '@/components/explore-section/Detail';
import { DeltaResource } from '@/types/explore-section';
import EphysViewerContainer from '@/components/explore-section/EphysViewerContainer';
import Contributors from '@/components/explore-section/Contributors';
import Species from '@/components/explore-section/Species';
import useDetailPage from '@/hooks/useDetailPage';
import usePathname from '@/hooks/pathname';

const fields = [
  {
    title: 'Description',
    field: ({ description }) => description,
    className: 'col-span-3 row-span-2',
  },
  {
    title: 'E-Type',
    field: ({ eType }) => eType,
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
] as DetailProps[];

export default function EphysDetailPage() {
  useDetailPage(usePathname());
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={fields} links={[{ url: '/explore/electrophysiology' }]}>
        {(detail: DeltaResource) => <EphysViewerContainer resource={detail} />}
      </Detail>
    </Suspense>
  );
}
