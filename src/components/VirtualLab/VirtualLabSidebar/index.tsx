'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { loadable, unwrap } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { SwapOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { detailAtom } from '../VirtualLabBanner';
import { virtualLabMembersAtomFamily } from '@/state/virtual-lab/lab';
import { virtualLabProjectsAtomFamily } from '@/state/virtual-lab/projects';
import VerticalLinks, { LinkItem } from '@/components/VerticalLinks';
import { LinkItemKey } from '@/constants/virtual-labs/sidemenu';

type Props = {
  virtualLabId: string;
};

function VirtualLabTitle() {
  const virtualLab = useAtomValue(detailAtom);

  return (
    <div className="text-5xl font-bold uppercase text-primary-5" style={{ minHeight: '84px' }}>
      {virtualLab?.name}
    </div>
  );
}

function UsersAmount({ virtualLabId }: Props) {
  const users = useAtomValue(
    useMemo(() => unwrap(virtualLabMembersAtomFamily(virtualLabId)), [virtualLabId])
  );

  if (users) {
    return <>{users.length} members</>;
  }
  return null;
}

function ProjectsAmount({ virtualLabId }: Props) {
  const projects = useAtomValue(
    useMemo(() => loadable(virtualLabProjectsAtomFamily(virtualLabId)), [virtualLabId])
  );
  if (projects.state === 'loading') {
    return null;
  }
  if (projects.state === 'hasData') {
    return projects.data?.results.length;
  }
  return null;
}

export default function VirtualLabSidebar({ virtualLabId }: Props) {
  const currentPage = usePathname().split('/').pop();

  const linkItems: LinkItem[] = [
    { key: LinkItemKey.Lab, content: 'Overview', href: 'overview' },
    {
      key: LinkItemKey.Projects,
      content: (
        <div className="flex justify-between">
          <span>Projects</span>
          <span className="font-normal text-primary-3">
            <ProjectsAmount virtualLabId={virtualLabId} />
          </span>
        </div>
      ),
      href: 'projects',
    },
    {
      key: LinkItemKey.Team,
      content: (
        <div className="flex justify-between">
          <span>Team</span>
          <span className="font-normal text-primary-3">
            <UsersAmount virtualLabId={virtualLabId} />
          </span>
        </div>
      ),
      href: 'team',
    },
    { key: LinkItemKey.Admin, content: 'Admin', href: 'admin' },
  ];
  return (
    <div className="mr-5 flex w-full flex-col gap-5">
      <VirtualLabTitle />
      <Link
        href="/virtual-lab"
        className="flex items-center justify-between border border-primary-7 p-3 text-primary-3"
      >
        <span>Switch virtual lab</span> <SwapOutlined />
      </Link>
      <VerticalLinks links={linkItems} currentPage={currentPage} />
    </div>
  );
}
