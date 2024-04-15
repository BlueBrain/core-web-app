'use client';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { ComponentType } from 'react';

import { VirtualLabMember } from '@/types/virtual-lab/members';
import { virtualLabProjectUsersAtomFamily } from '@/state/virtual-lab/projects';

type WithVirtualLabUsersProps = {
  users: VirtualLabMember[];
};

export default function withVirtualLabProjectUsers(
  WrappedComponent: ComponentType<WithVirtualLabUsersProps>,
  virtualLabId: string,
  projectId: string
) {
  function WithVirtualLabProjectUsers() {
    const projectMembers = useAtomValue(
      loadable(virtualLabProjectUsersAtomFamily({ virtualLabId, projectId }))
    );
    if (projectMembers.state === 'loading') {
      return (
        <div className="flex h-screen items-center justify-center">
          <Spin size="large" indicator={<LoadingOutlined />} />
        </div>
      );
    }
    if (projectMembers.state === 'hasError') {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="rounded-lg border p-8">
            Something went wrong when fetching virtual lab project users
          </div>
        </div>
      );
    }
    return <WrappedComponent users={projectMembers.data} />;
  }
  return WithVirtualLabProjectUsers;
}
