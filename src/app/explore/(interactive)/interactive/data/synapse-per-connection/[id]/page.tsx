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
    field: Field.PreSynapticBrainRegion,
  },
  {
    field: Field.SubjectSpecies,
  },
  {
    field: Field.MeanSTD,
  },
  {
    field: Field.PostSynapticBrainRegion,
  },
  {
    field: Field.SubjectAge,
  },
  {
    field: Field.Sem,
  },
  {
    field: Field.Contributors,
    className: 'row-span-2',
  },
  {
    field: Field.CreatedAt,
    className: 'row-span-2',
  },
  {
    field: Field.Licence,
    className: 'row-span-2',
  },
  {
    field: Field.PreSynapticCellType,
  },
  {
    field: Field.Weight,
  },
  {
    field: Field.NumberOfMeasurements,
  },
  {
    field: Field.PostSynapticCellType,
  },
] as DetailProps[];

export default function SynapsePerConnectionDetailPage() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={fields} />
    </Suspense>
  );
}
