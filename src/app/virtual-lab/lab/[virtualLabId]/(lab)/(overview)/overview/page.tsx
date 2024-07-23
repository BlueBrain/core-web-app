import { Suspense } from 'react';
import DiscoverObpPanel from '@/components/VirtualLab/DiscoverObpPanel';

import VirtualLabHome from '@/components/VirtualLab/VirtualLabHomePage';
import VirtualLabProjects from '@/components/VirtualLab/VirtualLabHomePage/VirtualLabProjects';
import VirtualLabUsers from '@/components/VirtualLab/VirtualLabHomePage/VirtualLabUsers';
import { ServerSideComponentProp } from '@/types/common';
import { VirtualLabDetailSkeleton } from '@/components/VirtualLab/VirtualLabBanner';
import NewProjectCTABanner from '@/components/VirtualLab/VirtualLabCTABanner/NewProjectCTABanner';

export default function VirtualLab({ params }: ServerSideComponentProp<{ virtualLabId: string }>) {
  const { virtualLabId } = params;
  return (
    <div className="pb-5">
      <Suspense fallback={<VirtualLabDetailSkeleton />}>
        <VirtualLabHome id={virtualLabId} />
      </Suspense>

      <NewProjectCTABanner
        id={virtualLabId}
        title="Create a project"
        subtitle="In order to start exploring brain regions, building models and simulate neuron, create a project"
      />

      <DiscoverObpPanel />
      <Suspense fallback={null}>
        <VirtualLabUsers id={virtualLabId} />
      </Suspense>
      <Suspense>
        <VirtualLabProjects id={virtualLabId} />
      </Suspense>
    </div>
  );
}
