'use client';

import { useMemo } from 'react';
import { Spin } from 'antd';
import { usePathname } from 'next/navigation';
import { loadable, unwrap } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { LoadingOutlined } from '@ant-design/icons';

import VirtualLabsSelect from './VirtualLabsSelect';
import { virtualLabDetailAtomFamily } from '@/state/virtual-lab/lab';
import { virtualLabProjectsAtomFamily } from '@/state/virtual-lab/projects';
import VerticalLinks, { LinkItem } from '@/components/VerticalLinks';
import { LinkItemKey } from '@/constants/virtual-labs/sidemenu';

type Props = {
  virtualLabId: string;
};

function VirtualLabTitle({ virtualLabId }: Props) {
  const virtualLab = useAtomValue(
    useMemo(() => unwrap(virtualLabDetailAtomFamily(virtualLabId)), [virtualLabId])
  );

  if (virtualLab) {
    return <div className="text-5xl font-bold uppercase text-primary-5">{virtualLab.name}</div>;
  }

  return null;
}

function UsersAmount({ virtualLabId }: Props) {
  const virtualLab = useAtomValue(
    useMemo(() => unwrap(virtualLabDetailAtomFamily(virtualLabId)), [virtualLabId])
  );

  if (virtualLab) {
    return <>{virtualLab.users.length} members</>;
  }
  return null;
}

function ProjectsAmount({ virtualLabId }: Props) {
  const projects = useAtomValue(
    useMemo(() => loadable(virtualLabProjectsAtomFamily(virtualLabId)), [virtualLabId])
  );
  if (projects.state === 'loading') {
    return <Spin indicator={<LoadingOutlined />} />;
  }
  if (projects.state === 'hasData' && projects.data) {
    return projects.data.results.length;
  }
  return null;
}

export default function VirtualLabSidebar({ virtualLabId }: Props) {
  const currentPage = usePathname().split('/').pop();

  const linkItems: LinkItem[] = [
    { key: LinkItemKey.Lab, content: 'The Virtual Lab', href: 'lab' },
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
    <div className="mr-12 flex w-full flex-col gap-5">
      <VirtualLabTitle virtualLabId={virtualLabId} />
      <VirtualLabsSelect />
      <VerticalLinks links={linkItems} currentPage={currentPage} />
    </div>
  );
}
