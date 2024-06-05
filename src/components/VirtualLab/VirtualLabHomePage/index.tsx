import VirtualLabCTABanner from '../VirtualLabCTABanner';
import VirtualLabDetail from './VirtualLabDetail';
import VirtualLabUsers from './VirtualLabUsers';
import VirtualLabProjects from './VirtualLabProjects';
import DiscoverObpPanel from '@/components/VirtualLab/DiscoverObpPanel';

type Props = {
  id?: string;
};

export default function VirtualLabHomePage({ id }: Props) {
  return (
    <div className="pb-5">
      <VirtualLabDetail id={id} />
      <VirtualLabCTABanner
        title="Create your first project"
        subtitle="In order to start exploring brain regions, building models and simulate neuron, create a project"
      />
      <DiscoverObpPanel />

      <VirtualLabUsers id={id} />
      <VirtualLabProjects id={id} />
    </div>
  );
}
