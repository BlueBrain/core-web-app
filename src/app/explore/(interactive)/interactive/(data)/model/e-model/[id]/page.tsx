'use client';

import { Suspense } from 'react';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import Detail from '@/components/explore-section/Detail';
import { E_MODEL_FIELDS } from '@/constants/explore-section/detail-views-fields';

export default function EModelDetailPage() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={E_MODEL_FIELDS} />
    </Suspense>
  );
}
