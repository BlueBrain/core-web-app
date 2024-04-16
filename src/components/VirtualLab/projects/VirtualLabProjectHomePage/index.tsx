'use client';

import { useCallback } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

import VirtualLabProjectBanner from '../VirtualLabProjectBanner';
import BudgetPanel from '@/components/VirtualLab/VirtualLabHomePage/BudgetPanel';
import Member from '@/components/VirtualLab/VirtualLabHomePage/Member';
import WelcomeUserBanner from '@/components/VirtualLab/VirtualLabHomePage/WelcomeUserBanner';
import {
  virtualLabProjectDetailsAtomFamily,
  virtualLabProjectUsersAtomFamily,
} from '@/state/virtual-lab/projects';
import useNotification from '@/hooks/notifications';

type Props = {
  virtualLabId: string;
  projectId: string;
};

export default function VirtualLabProjectHomePage({ virtualLabId, projectId }: Props) {
  const notification = useNotification();

  const projectDetails = useAtomValue(
    loadable(virtualLabProjectDetailsAtomFamily({ virtualLabId, projectId }))
  );
  const projectUsers = useAtomValue(
    loadable(virtualLabProjectUsersAtomFamily({ virtualLabId, projectId }))
  );

  const renderUsers = useCallback(() => {
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
    notification.error('Something went wrong when fetching users');
    return null;
  }, [notification, projectUsers]);

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
      <VirtualLabProjectBanner
        name={projectDetails.data.name}
        description={projectDetails.data.description}
        ownerName={projectDetails.data.owner.name}
        createdAt={projectDetails.data.created_at}
        users={projectUsers.state === 'hasData' ? projectUsers.data : []}
      />
      <BudgetPanel total={projectDetails.data.budget} totalSpent={300} remaining={350} />
      <div>
        <div className="my-10 text-lg font-bold uppercase">Members</div>
        <div className="flex-no-wrap flex overflow-x-auto overflow-y-hidden">{renderUsers()}</div>
      </div>
    </div>
  );
}
