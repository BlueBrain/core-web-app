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
    title: 'Mean ± STD',
    field: ({ meanPlusMinusStd }) => meanPlusMinusStd,
  },
  {
    title: 'Species',
    field: ({ species }) => species,
  },
  {
    title: 'M-Type',
    field: ({ mType }) => mType,
  },
  {
    title: 'SEM',
    field: ({ sem }) => sem,
  },
  {
    title: 'Weight',
    field: ({ weight }) => weight,
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
    title: 'Reference',
    field: () => '', // TODO: What is reference field?
  },
  {
    title: 'N˚ of cells',
    field: ({ numberOfMeasurement }) => numberOfMeasurement,
    className: 'col-span-2 col-start-5',
  },
] as DetailProps[];

export default function BoutonDensityDetails() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={fields} />
    </Suspense>
  );
}
