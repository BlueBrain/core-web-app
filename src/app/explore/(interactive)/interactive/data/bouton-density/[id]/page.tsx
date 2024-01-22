'use client';

import { Suspense } from 'react';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import Detail from '@/components/explore-section/Detail';
import { DetailProps } from '@/types/explore-section/application';
import { Field } from '@/constants/explore-section/fields-config/enums';

const fields = [
  {
    field: Field.Description,
    className: 'col-span-3 row-span-2',
  },
  {
    field: Field.BrainRegion,
  },
  {
    field: Field.MeanSTD,
  },
  {
    field: Field.SubjectSpecies,
  },
  {
    field: Field.MType,
  },
  {
    field: Field.Sem,
  },
  {
    field: Field.Weight,
  },
  {
    field: Field.Contributors,
  },
  {
    field: Field.CreatedAt,
  },
  {
    field: Field.NumberOfMeasurements,
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
