'use client';

import { Suspense } from 'react';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import Detail from '@/components/explore-section/Detail';
import { ExperimentalTrace } from '@/types/explore-section/delta-experiment';
import EphysViewerContainer from '@/components/explore-section/EphysViewerContainer';
import { ELECTRO_PHYSIOLOGY_FIELDS } from '@/constants/explore-section/detail-views-fields';

export default function EphysDetailPage() {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={ELECTRO_PHYSIOLOGY_FIELDS}>
        {(detail: ExperimentalTrace) => <EphysViewerContainer resource={detail} />}
      </Detail>
    </Suspense>
  );
}
