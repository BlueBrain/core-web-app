'use client';

import { CalendarOutlined, LoadingOutlined, UserOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

import BudgetPanel from '@/components/VirtualLab/VirtualLabHomePage/BudgetPanel';
import VirtualLabStatistic from '@/components/VirtualLab/VirtualLabStatistic';
import { EyeTargetIcon, MembersGroupIcon, StatsEditIcon } from '@/components/icons';
import Brain from '@/components/icons/Brain';
import { basePath } from '@/config';
import Member from '@/components/VirtualLab/VirtualLabHomePage/Member';
import WelcomeUserBanner from '@/components/VirtualLab/VirtualLabHomePage/WelcomeUserBanner';
import {
  virtualLabProjectDetailsAtomFamily,
  virtualLabProjectUsersAtomFamily,
} from '@/state/virtual-lab/projects';
import { formatDate } from '@/util/utils';

type Props = {
  virtualLabId: string;
  projectId: string;
};

export default function VirtualLabProjectHomePage({ virtualLabId, projectId }: Props) {
  const iconStyle = { color: '#69C0FF' };

  const projectDetails = useAtomValue(
    loadable(virtualLabProjectDetailsAtomFamily({ virtualLabId, projectId }))
  );
  const projectUsers = useAtomValue(
    loadable(virtualLabProjectUsersAtomFamily({ virtualLabId, projectId }))
  );

  const renderUsers = () => {
    if (projectUsers.state === 'loading') {
      return <Spin indicator={<LoadingOutlined />} />;
    }
    if (projectUsers.state === 'hasData') {
      return projectUsers.data.map((user) => (
        <Member
          key={user.id}
          firstName="TO BE REPLACED"
          lastName="TO BE REPLACED"
          name={user.name}
          lastActive="N/A"
          memberRole="member"
        />
      ));
    }
    return null;
  };

  const renderUserAmount = () => {
    if (projectUsers.state === 'loading') {
      return <Spin indicator={<LoadingOutlined />} />;
    }
    if (projectUsers.state === 'hasData') {
      return projectUsers.data.length;
    }
    return null;
  };

  if (projectDetails.state === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" indicator={<LoadingOutlined />} />
      </div>
    );
  }
  if (projectDetails.state === 'hasError') {
    return null;
  }

  return (
    <div>
      <WelcomeUserBanner title={projectDetails.data.name} />
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
              <h2 className="text-4xl font-bold">{projectDetails.data.name}</h2>
            </div>
            <div>{projectDetails.data.description}</div>
          </div>
        </div>
        <div className="flex gap-5">
          <VirtualLabStatistic
            icon={<EyeTargetIcon style={iconStyle} />}
            title="Explore sessions"
            detail="N/A"
          />
          <VirtualLabStatistic icon={<Brain style={iconStyle} />} title="Builds" detail="N/A" />
          <VirtualLabStatistic
            icon={<StatsEditIcon style={iconStyle} />}
            title="Simulation Experiments"
            detail="N/A"
          />
          <VirtualLabStatistic
            icon={<UserOutlined style={iconStyle} />}
            title="Members"
            detail={renderUserAmount()}
          />
          <VirtualLabStatistic
            icon={<MembersGroupIcon style={iconStyle} />}
            title="Admin"
            detail={projectDetails.data.owner.name}
          />
          <VirtualLabStatistic
            icon={<CalendarOutlined style={iconStyle} />}
            title="Creation date"
            detail={formatDate(projectDetails.data.created_at)}
          />
        </div>
      </div>
      <BudgetPanel total={projectDetails.data.budget} totalSpent={300} remaining={350} />
      <div>
        <div className="my-10 text-lg font-bold uppercase">Members</div>
        <div className="flex-no-wrap flex overflow-x-auto overflow-y-hidden">{renderUsers()}</div>
      </div>
    </div>
  );
}
