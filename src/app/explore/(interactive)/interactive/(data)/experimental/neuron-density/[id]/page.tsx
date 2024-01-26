'use client';

import { Suspense } from 'react';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import Detail from '@/components/explore-section/Detail';
import { NEURON_DENSITY_FIELDS } from '@/constants/explore-section/detail-views-fields';

export default function NeuronDensityDetailPage() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={NEURON_DENSITY_FIELDS} />
    </Suspense>
  );
}
