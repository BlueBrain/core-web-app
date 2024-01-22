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
    field: Field.SubjectSpecies,
  },
  {
    field: Field.NumberOfMeasurements,
  },
  {
    field: Field.SubjectAge,
  },
  {
    field: Field.MType,
  },
  {
    field: Field.EType,
  },
  {
    field: Field.Contributors,
    className: 'row-span-3',
  },
  {
    field: Field.CreatedAt,
    className: 'col-span-2',
  },
  {
    field: Field.NeuronDensity,
  },
] as DetailProps[];

export default function NeuronDensityDetailPage() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={fields} />
    </Suspense>
  );
}
