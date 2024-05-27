'use client';

import { CalendarOutlined, LoadingOutlined, UserOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useAtomValue } from 'jotai';
import { loadable, unwrap } from 'jotai/utils';

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
import useNotification from '@/hooks/notifications';

type Props = {
  virtualLabId: string;
  projectId: string;
};

function VirtualLabUsersHorizontalList({ virtualLabId, projectId }: Props) {
  const notification = useNotification();

  const projectUsers = useAtomValue(
    loadable(virtualLabProjectUsersAtomFamily({ virtualLabId, projectId }))
  );
  if (projectUsers.state === 'loading') {
    return <Spin indicator={<LoadingOutlined />} />;
  }
  if (projectUsers.state === 'hasData') {
    return (
      <div className="flex-no-wrap flex overflow-x-auto overflow-y-hidden">
        {projectUsers.data?.map((user) => (
          <Member
            key={user.id}
            firstName={user.first_name}
            lastName={user.last_name}
            name={user.name}
            lastActive="N/A"
            memberRole="member"
          />
        ))}
      </div>
    );
  }
  if (projectUsers.state === 'hasError') {
    notification.error('Something went wrong when fetching users');
  }

  return null;
}

function VirualLabUsersAmount({ virtualLabId, projectId }: Props) {
  const projectUsers = useAtomValue(
    loadable(virtualLabProjectUsersAtomFamily({ virtualLabId, projectId }))
  );
  if (projectUsers.state === 'loading') {
    return <Spin indicator={<LoadingOutlined />} />;
  }
  if (projectUsers.state === 'hasData') {
    return projectUsers.data?.length;
  }
  return null;
}

export default function VirtualLabProjectHomePage({ virtualLabId, projectId }: Props) {
  const iconStyle = { color: '#69C0FF' };

  const projectDetails = useAtomValue(
    unwrap(virtualLabProjectDetailsAtomFamily({ virtualLabId, projectId }))
  );

  const projectUsers = useAtomValue(
    unwrap(virtualLabProjectUsersAtomFamily({ virtualLabId, projectId }))
  );

  if (projectDetails) {
    return (
      <div>
        <WelcomeUserBanner title={projectDetails.name} />
        <div className="relative mt-10 flex flex-col gap-4 overflow-hidden bg-primary-8 p-8">
          <div
            className="absolute right-[-150px] top-[-220px] h-[500px] w-[500px]  rotate-[-135deg] transform  bg-cover bg-left-top bg-right-top bg-no-repeat"
            style={{
              backgroundImage: `url(${basePath}/images/virtual-lab/obp_neocortex.webp)`,
            }}
          />
          <div className="flex flex-row justify-between">
            <div className="flex max-w-[50%] flex-col gap-2">
              <div>
                <div className="text-primary-2">Name</div>
                <h2 className="text-4xl font-bold">{projectDetails.name}</h2>
              </div>
              <div>{projectDetails.description}</div>
            </div>
          </div>
          <div className="z-10 flex gap-3 flex-wrap text-sm">
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
              detail={<VirualLabUsersAmount virtualLabId={virtualLabId} projectId={projectId} />}
            />
            <VirtualLabStatistic
              icon={<MembersGroupIcon style={iconStyle} />}
              title="Admin"
              detail={projectUsers?.find(({ role }) => role === 'admin')?.name}
            />
            <VirtualLabStatistic
              icon={<CalendarOutlined style={iconStyle} />}
              title="Creation date"
              detail={formatDate(projectDetails.created_at)}
            />
          </div>
        </div>
        <BudgetPanel total={projectDetails.budget} totalSpent={300} remaining={350} />
        <div>
          <div className="my-10 text-lg font-bold uppercase">Members</div>
          <VirtualLabUsersHorizontalList virtualLabId={virtualLabId} projectId={projectId} />
        </div>
      </div>
    );
  }
  return null;
}
