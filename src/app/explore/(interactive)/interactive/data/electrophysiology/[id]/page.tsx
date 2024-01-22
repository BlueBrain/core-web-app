'use client';

import { Suspense } from 'react';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import Detail from '@/components/explore-section/Detail';
import { DeltaResource } from '@/types/explore-section/resources';
import EphysViewerContainer from '@/components/explore-section/EphysViewerContainer';
import { DetailProps } from '@/types/explore-section/application';
import { Field } from '@/constants/explore-section/fields-config/enums';

const fields = [
  {
    field: Field.Description,
    className: 'col-span-3 row-span-2',
  },
  {
    field: Field.EType,
    className: 'row-span-2',
  },
  {
    field: Field.SubjectSpecies,
    className: 'row-span-2',
  },
  {
    field: Field.BrainRegion,
    className: 'row-span-2',
  },
  {
    field: Field.Contributors,
    className: 'col-span-3',
  },
  {
    field: Field.CreatedAt,
  },
] as DetailProps[];

export default function EphysDetailPage() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={fields}>
        {(detail: DeltaResource) => <EphysViewerContainer resource={detail} />}
      </Detail>
    </Suspense>
  );
}
