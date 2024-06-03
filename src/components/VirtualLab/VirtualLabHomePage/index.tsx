import VirtualLabCTABanner from '../VirtualLabCTABanner';
import VirtualLabBanner from '../VirtualLabBanner';
import VirtualLabMainStatistics from '../VirtualLabMainStatistics';
import BudgetPanel from './BudgetPanel';
import Member from './Member';
import ProjectItem from './ProjectItem';
import WelcomeUserBanner from './WelcomeUserBanner';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';
import DiscoverObpPanel from '@/components/VirtualLab/DiscoverObpPanel';
import { getVirtualLabDetail, getVirtualLabUsers } from '@/services/virtual-lab/labs';
import { getVirtualLabProjects } from '@/services/virtual-lab/projects';

type Props = {
  id?: string;
};

export default async function VirtualLabHomePage({ id }: Props) {
  const virtualLabDetail = id ? (await getVirtualLabDetail(id)).data.virtual_lab : undefined;
  const virtualLabUsers = id ? (await getVirtualLabUsers(id)).data.users : [];
  const virtualLabProjects = id ? (await getVirtualLabProjects(id)).data.results : undefined;

  return (
    <div className="pb-5">
      <WelcomeUserBanner title={virtualLabDetail && virtualLabDetail.name} />
      <div className="mt-10">
        <VirtualLabBanner
          id={virtualLabDetail?.id}
          name={virtualLabDetail?.name}
          description={virtualLabDetail?.description}
          withEditButton
          bottomElements={
            <VirtualLabMainStatistics id={id} created_at={virtualLabDetail?.created_at} />
          }
        />
      </div>
      <BudgetPanel
        total={virtualLabDetail && virtualLabDetail.budget}
        totalSpent={300}
        remaining={350}
      />
      <VirtualLabCTABanner
        title="Create your first project"
        subtitle="In order to start exploring brain regions, building models and simulate neuron, create a project"
      />
      <DiscoverObpPanel />
      <div>
        <div className="my-5 text-lg font-bold uppercase">Members</div>
        <div className="flex-no-wrap flex overflow-x-auto overflow-y-hidden">
          {virtualLabUsers?.map((user) => (
            <Member
              key={user.id}
              name={user.name}
              lastActive="N/A"
              memberRole={user.role}
              firstName={user.first_name}
              lastName={user.last_name}
            />
          ))}
        </div>
      </div>
      <div className="mt-10">
        <div className="my-5 text-lg font-bold uppercase">Highlighted Projects</div>
        <div className="flex flex-row gap-5">
          {virtualLabProjects?.map((project) => (
            <ProjectItem
              key={project.id}
              title={project.name}
              description={project.description}
              buttonHref={id && `${generateVlProjectUrl(id, project.id)}/home`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
