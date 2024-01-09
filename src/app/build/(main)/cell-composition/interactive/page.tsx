'use client';

import useLiteratureCleanNavigate from '@/components/explore-section/Literature/useLiteratureCleanNavigate';
import ThreeDeeBrain from '@/components/ThreeDeeBrain';
import { useDisplayMesh } from '@/hooks/brain-region-panel';

export default function InteractiveView() {
  useLiteratureCleanNavigate();
  useDisplayMesh();

  return (
    <div className="h-full w-full bg-black">
      <ThreeDeeBrain />
    </div>
  );
}
