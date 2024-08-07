'use client';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

import Member from '@/components/VirtualLab/VirtualLabHomePage/Member';
import { ProjectDetailBanner } from '@/components/VirtualLab/VirtualLabBanner';
import WelcomeUserBanner from '@/components/VirtualLab/VirtualLabHomePage/WelcomeUserBanner';
import {
  virtualLabProjectDetailsAtomFamily,
  virtualLabProjectUsersAtomFamily,
} from '@/state/virtual-lab/projects';
import useNotification from '@/hooks/notifications';
import { useLoadableValue, useUnwrappedValue } from '@/hooks/hooks';

type Props = {
  virtualLabId: string;
  projectId: string;
};

function VirtualLabUsersHorizontalList({ virtualLabId, projectId }: Props) {
  const notification = useNotification();

  const projectUsers = useLoadableValue(
    virtualLabProjectUsersAtomFamily({ virtualLabId, projectId })
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

export default function VirtualLabProjectHomePage({ virtualLabId, projectId }: Props) {
  const projectDetails = useUnwrappedValue(
    virtualLabProjectDetailsAtomFamily({ virtualLabId, projectId })
  );

  if (projectDetails) {
    return (
      <div>
        <WelcomeUserBanner title={projectDetails.name} />
        <ProjectDetailBanner
          createdAt={projectDetails.created_at}
          description={projectDetails.description}
          name={projectDetails.name}
          projectId={projectId}
          virtualLabId={virtualLabId}
        />
        <div>
          <div className="my-10 text-lg font-bold uppercase">Members</div>
          <VirtualLabUsersHorizontalList virtualLabId={virtualLabId} projectId={projectId} />
        </div>
      </div>
    );
  }
  return null;
}
