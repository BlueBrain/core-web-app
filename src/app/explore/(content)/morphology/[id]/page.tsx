'use client';

import { Suspense } from 'react';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import Detail, { DetailProps, ListField } from '@/components/explore-section/Detail';
import MorphoViewerContainer from '@/components/explore-section/MorphoViewerContainer';
import { DeltaResource } from '@/types/explore-section';

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
    field: ({ species }) => species,
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
    field: ({ contributors }) => <ListField items={contributors} />,
  },
  {
    title: 'Created On',
    field: ({ creationDate }) => creationDate,
  },
] as DetailProps[];

export default function MorphologyDetailPage() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={fields} links={[{ url: '/explore/morphology' }]}>
        {(detail: DeltaResource) => <MorphoViewerContainer resource={detail} />}
      </Detail>
    </Suspense>
  );
}
