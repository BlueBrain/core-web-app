import { Suspense } from 'react';
import DiscoverObpPanel from '@/components/VirtualLab/DiscoverObpPanel';

import VirtualLabHome from '@/components/VirtualLab/VirtualLabHomePage';
import VirtualLabUsers from '@/components/VirtualLab/VirtualLabHomePage/VirtualLabUsers';
import { ServerSideComponentProp } from '@/types/common';
import NewProjectCTABanner from '@/components/VirtualLab/VirtualLabCTABanner/NewProjectCTABanner';

export default function VirtualLab({ params }: ServerSideComponentProp<{ virtualLabId: string }>) {
  const { virtualLabId } = params;
  return (
    <div className="pb-5">
      <VirtualLabHome id={virtualLabId} />

      <NewProjectCTABanner
        id={virtualLabId}
        title="Create a project"
        subtitle="In order to start exploring brain regions, building models and simulate neuron, create a project"
      />

      <DiscoverObpPanel />
      <Suspense fallback={null}>
        <VirtualLabUsers id={virtualLabId} />
      </Suspense>
      {/* Temporarily removing the display of highlighted projects */}
      {/* <Suspense> */}
      {/* <VirtualLabProjects id={virtualLabId} /> */}
      {/* </Suspense>  */}
    </div>
  );
}
