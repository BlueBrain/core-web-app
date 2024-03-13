'use client';

import EModelInteractiveView from '@/components/build-section/cell-model-assignment/e-model/interactive/View';
import useLiteratureCleanNavigate from '@/components/explore-section/Literature/useLiteratureCleanNavigate';

export default function InteractivePage() {
  useLiteratureCleanNavigate();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-10 bg-gray-950 text-white">
      <EModelInteractiveView />
    </div>
  );
}
