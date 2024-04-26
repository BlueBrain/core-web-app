import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { ComponentType } from 'react';

import { VirtualLabMember } from '@/types/virtual-lab/members';
import { virtualLabProjectUsersAtomFamily } from '@/state/virtual-lab/projects';
import { virtualLabMembersAtomFamily } from '@/state/virtual-lab/lab';

type WithVirtualLabUsersProps = {
  users: VirtualLabMember[];
};

export default function withVirtualLabUsers(
  WrappedComponent: ComponentType<WithVirtualLabUsersProps>,
  virtualLabId: string,
  projectId?: string
) {
  function WithVirtualLabUsers() {
    const usersAtom = projectId
      ? virtualLabProjectUsersAtomFamily({ virtualLabId, projectId })
      : virtualLabMembersAtomFamily(virtualLabId);

    const users = useAtomValue(loadable(usersAtom));

    if (users.state === 'loading') {
      return (
        <div className="flex h-screen items-center justify-center">
          <Spin size="large" indicator={<LoadingOutlined />} />
        </div>
      );
    }
    if (users.state === 'hasError') {
      const errorMessage = projectId
        ? 'Something went wrong when fetching virtual lab project users'
        : 'Something went wrong when fetching virtual lab users';
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="rounded-lg border p-8">{errorMessage}</div>
        </div>
      );
    }
    if (users.data) {
      return <WrappedComponent users={users.data} />;
    }
    return <WrappedComponent users={[]} />;
  }
  return WithVirtualLabUsers;
}
