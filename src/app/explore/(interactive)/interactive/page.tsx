'use client';

import SelectedBrainRegionPanel from '@/components/explore-section/ExploreInteractive/SelectedBrainRegionPanel';
import ThreeDeeBrain from '@/components/ThreeDeeBrain';
import { useCollectExperimentalData } from '@/hooks/brain-region-panel';

export default function InteractivePage() {
  useCollectExperimentalData();

  return (
    <div className="relative min-w-0 min-h-0 overflow-hidden">
      <ThreeDeeBrain />
      <SelectedBrainRegionPanel />
    </div>
  );
}
