import { CalendarOutlined, UserOutlined } from '@ant-design/icons';

import BudgetPanel from '@/components/VirtualLab/VirtualLabHomePage/BudgetPanel';
import VirtualLabStatistic from '@/components/VirtualLab/VirtualLabStatistic';
import { mockProjects } from '@/components/VirtualLab/mockData/projects';
import { EyeTargetIcon, MembersGroupIcon, StatsEditIcon } from '@/components/icons';
import Brain from '@/components/icons/Brain';
import { basePath } from '@/config';
import Member from '@/components/VirtualLab/VirtualLabHomePage/Member';
import { mockMembers } from '@/components/VirtualLab/mockData/members';
import WelcomeUserBanner from '@/components/VirtualLab/VirtualLabHomePage/WelcomeUserBanner';

export default function VirtualLabProjectPage() {
  const project = mockProjects[0];
  const iconStyle = { color: '#69C0FF' };

  return (
    <div>
      <WelcomeUserBanner title={project.title} />
      <div className="relative mt-10 flex flex-col gap-4 overflow-hidden bg-primary-8 p-8">
        <div
          className="absolute right-[-150px] top-[-220px] h-[500px] w-[500px]  rotate-[-135deg] transform  bg-cover bg-left-top bg-right-top bg-no-repeat"
          style={{
            backgroundImage: `url(${basePath}/images/virtual-lab/obp_neocortex.png)`,
          }}
        />
        <div className="flex flex-row justify-between">
          <div className="flex max-w-[50%] flex-col gap-2">
            <div>
              <div className="text-primary-2">Name</div>
              <h2 className="text-4xl font-bold">{project.title}</h2>
            </div>
            <div>{project.description}</div>
          </div>
        </div>
        <div className="flex gap-5">
          <VirtualLabStatistic
            icon={<EyeTargetIcon style={iconStyle} />}
            title="Explore sessions"
            detail={project.exploreSessions}
          />
          <VirtualLabStatistic
            icon={<Brain style={iconStyle} />}
            title="Builds"
            detail={project.builds}
          />
          <VirtualLabStatistic
            icon={<StatsEditIcon style={iconStyle} />}
            title="Simulation Experiments"
            detail={project.simulationExperiments}
          />
          <VirtualLabStatistic
            icon={<UserOutlined style={iconStyle} />}
            title="Members"
            detail={project.members}
          />
          <VirtualLabStatistic
            icon={<MembersGroupIcon style={iconStyle} />}
            title="Admin"
            detail={project.admin}
          />
          <VirtualLabStatistic
            icon={<CalendarOutlined style={iconStyle} />}
            title="Creation date"
            detail={project.creationDate}
          />
        </div>
      </div>
      <BudgetPanel
        total={project.budget.total}
        totalSpent={project.budget.totalSpent}
        remaining={project.budget.remaining}
      />
      <div>
        <div className="my-10 text-lg font-bold uppercase">Members</div>
        <div className="flex-no-wrap flex overflow-x-auto overflow-y-hidden">
          {mockMembers.map((member) => (
            <Member
              key={member.key}
              name={member.name}
              lastActive={member.lastActive}
              memberRole={member.role}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
