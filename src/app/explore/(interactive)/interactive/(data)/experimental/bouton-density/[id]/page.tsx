'use client';

import { Suspense } from 'react';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import Detail from '@/components/explore-section/Detail';
import { BOUTON_DENSITY_FIELDS } from '@/constants/explore-section/detail-views-fields';

export default function BoutonDensityDetails() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={BOUTON_DENSITY_FIELDS} />
    </Suspense>
  );
}
