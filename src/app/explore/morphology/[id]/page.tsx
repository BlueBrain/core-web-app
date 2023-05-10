'use client';

import { Suspense } from 'react';
import { createNexusClient } from '@bbp/nexus-sdk';
import { useSession } from 'next-auth/react';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import Detail, { DetailProps, ListField } from '@/components/explore-section/Detail';
import { DeltaResource } from '@/types/explore-section';
import { nexus as nexusConfig } from '@/config';
import MorphoViewerContainer from '@/components/explore-section/MorphoViewerContainer';

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
    field: () => '', // TODO: What is reference field?
  },
  {
    title: 'Brain Region',
    field: ({ brainRegion }) => brainRegion,
  },
  {
    title: 'Conditions',
    field: () => '', // TODO: What is conditions field?
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
  const { data: session } = useSession();
  const nexus = createNexusClient({ uri: nexusConfig.url, token: session?.accessToken });

  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={fields}>
        {(detail: DeltaResource) => <MorphoViewerContainer resource={detail} nexus={nexus} />}
      </Detail>
    </Suspense>
  );
}
