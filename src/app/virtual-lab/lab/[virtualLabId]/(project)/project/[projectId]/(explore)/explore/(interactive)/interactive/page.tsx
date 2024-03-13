'use client';

import VirtualLabHistoryPanel from '@/components/VirtualLab/VirtualLabHistoryPanel';
import ExploreInteractivePanel from '@/components/explore-section/ExploreInteractive';

export default function VirtualLabProjectInteractiveExploreLayout() {
  return (
    <div className="flex h-screen flex-col">
      <VirtualLabHistoryPanel />
      <ExploreInteractivePanel />
    </div>
  );
}
