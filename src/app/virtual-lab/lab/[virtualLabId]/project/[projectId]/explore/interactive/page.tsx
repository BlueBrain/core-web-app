'use client';

import ExploreInteractivePanel from '@/components/explore-section/ExploreInteractive';
import { VirtualLabInfo } from '@/types/virtual-lab/common';

export default function VirtualLabProjectInteractiveExploreLayout({
  params,
}: {
  params: { virtualLabId: string; projectId: string };
}) {
  const virtualLabInfo: VirtualLabInfo = {
    virtualLabId: params.virtualLabId,
    projectId: params.projectId,
  };
  return (
    <div className="flex h-screen flex-col">
      <ExploreInteractivePanel virtualLabInfo={virtualLabInfo} />
    </div>
  );
}
