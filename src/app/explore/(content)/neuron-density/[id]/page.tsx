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
    title: 'Mean ± STD',
    field: ({ meanPlusMinusStd }) => meanPlusMinusStd,
  },
  {
    title: 'Species',
    field: <Species />,
  },
  {
    title: 'Reference',
  },
  {
    title: 'Number of Measurement',
    field: ({ numberOfMeasurement }) => numberOfMeasurement,
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
    className: 'col-span-3',
  },
  {
    title: 'Conditions',
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
