'use client';

import SelectedBrainRegionPanel from '@/components/explore-section/ExploreInteractive/SelectedBrainRegionPanel';
import ThreeDeeBrain from '@/components/ThreeDeeBrain';

export default function InteractivePage() {
  return (
    <div className="relative min-w-0 min-h-0 overflow-hidden">
      <ThreeDeeBrain />
      <SelectedBrainRegionPanel />
    </div>
  );
}
