'use client';

import SelectedBrainRegionPanel from '@/components/explore-section/ExploreInteractive/SelectedBrainRegionPanel';
import ThreeDeeBrain from '@/components/ThreeDeeBrain';

export default function InteractivePage() {
  return (
    <div className="relative">
      <ThreeDeeBrain />
      <SelectedBrainRegionPanel />
    </div>
  );
}
