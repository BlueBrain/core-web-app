'use client';

import { Suspense } from 'react';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import Detail, { DetailProps } from '@/components/explore-section/Detail';
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
    title: 'N˚ of Measurements',
    field: ({ numberOfMeasurements }) => numberOfMeasurements,
  },
  {
    title: 'Age',
    field: ({ subjectAge }) => subjectAge,
    className: 'col-span-2',
  },
  {
    title: ({ contributors }) => (contributors?.length === 1 ? 'Contributor' : 'Contributors'),
    field: <Contributors />,
    className: 'row-span-3',
  },
  {
    title: 'Creation Date',
    field: ({ creationDate }) => creationDate,
    className: 'col-span-2 row-span-3',
  },
  {
    title: 'M-Type',
    field: ({ mType }) => mType,
  },
  {
    title: 'Conditions',
    className: 'col-span-2',
  },
  {
    title: 'E-Type',
    field: ({ eType }) => eType,
    className: 'col-span-3',
  },
  {
    title: 'Density',
    field: ({ density }) => density,
  },
] as DetailProps[];

export default function NeuronDensityDetailPage() {
  useDetailPage(usePathname());
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={fields} links={[{ url: '/explore/neuron-density' }]} />
    </Suspense>
  );
}
