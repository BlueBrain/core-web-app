'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

import useLiteratureCleanNavigate from '@/components/explore-section/Literature/useLiteratureCleanNavigate';

const EModelInteractiveView = dynamic(
  () => import('@/components/build-section/cell-model-assignment/e-model/interactive/View'),
  { ssr: false }
);

export default function InteractivePage() {
  useLiteratureCleanNavigate();

  return (
    <div className="h-full bg-gray-950">
      <Suspense fallback={null}>
        <EModelInteractiveView />
      </Suspense>
    </div>
  );
}
