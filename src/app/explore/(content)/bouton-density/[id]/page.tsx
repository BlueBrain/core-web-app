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
    title: 'Mean ± STD',
    field: ({ meanPlusMinusStd }) => meanPlusMinusStd,
  },
  {
    title: 'Species',
    field: <Species />,
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
    field: <Contributors />,
  },
  {
    title: 'Created On',
    field: ({ creationDate }) => creationDate,
  },
  {
    title: 'Reference',
  },
  {
    title: 'N˚ of Measurements',
    field: ({ numberOfMeasurements }) => numberOfMeasurements,
    className: 'col-span-2 col-start-5',
  },
] as DetailProps[];

export default function BoutonDensityDetails() {
  useDetailPage(usePathname());
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={fields} links={[{ url: '/explore/bouton-density' }]} />
    </Suspense>
  );
}
