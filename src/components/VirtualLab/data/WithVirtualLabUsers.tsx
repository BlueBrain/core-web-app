'use client';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { ComponentType } from 'react';

import { virtualLabMembersAtomFamily } from '@/state/virtual-lab/lab';
import { VirtualLabMember } from '@/types/virtual-lab/members';

type WithVirtualLabUsersProps = {
  users: VirtualLabMember[];
};

export default function withVirtualLabUsers(
  WrappedComponent: ComponentType<WithVirtualLabUsersProps>,
  virtualLabId: string
) {
  function WithVirtualLabUsers() {
    const virtualLabMembers = useAtomValue(loadable(virtualLabMembersAtomFamily(virtualLabId)));
    if (virtualLabMembers.state === 'loading') {
      return (
        <div className="flex h-screen items-center justify-center">
          <Spin size="large" indicator={<LoadingOutlined />} />
        </div>
      );
    }
    if (virtualLabMembers.state === 'hasError') {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="rounded-lg border p-8">
            Something went wrong when fetching virtual lab users
          </div>
        </div>
      );
    }
    return <WrappedComponent users={virtualLabMembers.data} />;
  }
  return WithVirtualLabUsers;
}
