'use client';

import { Suspense } from 'react';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import Detail, { DetailProps, ListField } from '@/components/explore-section/Detail';

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
    field: ({ species }) => species,
    className: 'col-span-2',
  },
  {
    title: 'Thickness',
    field: ({ thickness }) => thickness,
  },
  {
    title: 'Age',
    field: ({ subjectAge }) => subjectAge,
    className: 'col-span-2',
  },
  {
    title: ({ contributors }) => (contributors?.length === 1 ? 'Contributor' : 'Contributors'),
    field: ({ contributors }) => <ListField items={contributors} />,
  },
  {
    title: 'Created On',
    field: ({ creationDate }) => creationDate,
  },
  {
    title: 'Licence',
    field: ({ license }) => license,
  },
] as DetailProps[];

export default function LayerThicknessDetailPage() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={fields} links={[{ url: '/explore/layer-thickness' }]} />
    </Suspense>
  );
}
