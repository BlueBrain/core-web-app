import { Suspense } from 'react';
import VirtualLabCTABanner from '../VirtualLabCTABanner';
import VirtualLabDetailServer from './VirtualLabDetailServer';
import VirtualLabDetail, { VirtualLabDetailSkeleton } from './VirtualLabDetail';
import VirtualLabUsers from './VirtualLabUsers';
import VirtualLabProjects from './VirtualLabProjects';
import DiscoverObpPanel from '@/components/VirtualLab/DiscoverObpPanel';

type Props = {
  id: string;
};

export default function VirtualLabHomePage({ id }: Props) {
  return (
    <div className="pb-5">
      <Suspense fallback={<VirtualLabDetailSkeleton />}>
        <VirtualLabDetailServer id={id} />
      </Suspense>

      <VirtualLabCTABanner
        id={id}
        title="Create a project"
        subtitle="In order to start exploring brain regions, building models and simulate neuron, create a project"
      />
      <DiscoverObpPanel />
      <Suspense fallback={null}>
        <VirtualLabUsers id={id} />
      </Suspense>
      <Suspense>
        <VirtualLabProjects id={id} />
      </Suspense>
    </div>
  );
}
