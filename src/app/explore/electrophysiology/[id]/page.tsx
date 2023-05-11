'use client';

import { Suspense } from 'react';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import Detail, { DetailProps, ListField } from '@/components/explore-section/Detail';
import { DeltaResource } from '@/types/explore-section';
import EphysViewerContainer from '@/components/explore-section/EphysViewerContainer';

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
    field: ({ species }) => species,
  },
  {
    title: 'Reference',
    field: '', // TODO: What is reference field?
  },
  {
    title: 'Brain Region',
    field: ({ brainRegion }) => brainRegion,
  },
  {
    title: 'Conditions',
    field: '', // TODO: What is conditions field?
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

export default function EphysDetailPage() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail
        fields={fields}
        links={[{ url: '/explore/electrophysiology', title: 'Neuron electrophysiology' }]}
      >
        {(detail: DeltaResource) => <EphysViewerContainer resource={detail} />}
      </Detail>
    </Suspense>
  );
}
