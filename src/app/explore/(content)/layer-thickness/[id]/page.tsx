'use client';

import { Suspense } from 'react';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import Detail, { DetailProps } from '@/components/explore-section/Detail';
import useDetailPage from '@/hooks/useDetailPage';
import usePathname from '@/hooks/pathname';
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
    title: 'Brain Region',
    field: ({ brainRegion }) => brainRegion,
  },
  {
    title: 'Species',
    field: <Species />,
  },
  {
    title: 'Reference',
  },
  {
    title: 'Layer',
    field: ({ layer }) => layer,
  },
  {
    title: 'Age',
    field: ({ subjectAge }) => subjectAge,
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
  {
    title: 'Thickness',
    field: ({ thickness }) => thickness,
  },
  {
    title: 'Conditions',
    field: ({ conditions }) => conditions,
  },
] as DetailProps[];

export default function LayerThicknessDetailPage() {
  useDetailPage(usePathname());

  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={fields} links={[{ url: '/explore/layer-thickness' }]} />
    </Suspense>
  );
}
