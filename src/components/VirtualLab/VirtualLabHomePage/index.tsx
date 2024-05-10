'use client';

import { unwrap } from 'jotai/utils';
import { useAtomValue } from 'jotai';

import VirtualLabBanner from '../VirtualLabBanner';
import VirtualLabMainStatistics from '../VirtualLabMainStatistics';
import BudgetPanel from './BudgetPanel';
import Member from './Member';
import ProjectItem from './ProjectItem';
import WelcomeUserBanner from './WelcomeUserBanner';
import { virtualLabDetailAtomFamily, virtualLabMembersAtomFamily } from '@/state/virtual-lab/lab';
import { virtualLabProjectsAtomFamily } from '@/state/virtual-lab/projects';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';
import DiscoverObpPanel from '@/components/VirtualLab/DiscoverObpPanel';

type Props = {
  id: string;
};

export default function VirtualLabHomePage({ id }: Props) {
  const virtualLabDetail = useAtomValue(unwrap(virtualLabDetailAtomFamily(id)));
  const virtualLabUsers = useAtomValue(unwrap(virtualLabMembersAtomFamily(id)));
  const virtualLabProjects = useAtomValue(unwrap(virtualLabProjectsAtomFamily(id)));

  if (virtualLabDetail) {
    return (
      <div className="pb-5">
        <WelcomeUserBanner title={virtualLabDetail.name} />
        <div className="mt-10">
          <VirtualLabBanner
            id={virtualLabDetail.id}
            name={virtualLabDetail.name}
            description={virtualLabDetail.description}
            withEditButton
            bottomElements={
              <VirtualLabMainStatistics id={id} created_at={virtualLabDetail.created_at} />
            }
          />
        </div>
        <BudgetPanel total={virtualLabDetail.budget} totalSpent={300} remaining={350} />
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
            {virtualLabProjects?.results
              .slice(0, 3)
              .map((project) => (
                <ProjectItem
                  key={project.id}
                  title={project.name}
                  description={project.description}
                  buttonHref={`${generateVlProjectUrl(id, project.id)}/home`}
                />
              ))}
          </div>
        </div>
      </div>
    );
  }
  return null;
}
