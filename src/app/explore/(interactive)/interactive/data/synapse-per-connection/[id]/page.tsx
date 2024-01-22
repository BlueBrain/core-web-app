'use client';

import { Suspense } from 'react';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import Detail from '@/components/explore-section/Detail';
import { SYNAPSE_PER_CONNECTION_FIELDS } from '@/constants/explore-section/detail-views-fields';

export default function SynapsePerConnectionDetailPage() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={SYNAPSE_PER_CONNECTION_FIELDS} />
    </Suspense>
  );
}
