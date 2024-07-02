'use client';

import { usePathname } from 'next/navigation';
import { useAtomValue } from 'jotai';
import { SwapOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { virtualLabMembersAtomFamily } from '@/state/virtual-lab/lab';
import { virtualLabProjectsAtomFamily } from '@/state/virtual-lab/projects';
import VerticalLinks, { LinkItem } from '@/components/VerticalLinks';
import { LinkItemKey } from '@/constants/virtual-labs/sidemenu';
import { getAtom } from '@/state/state';
import { VirtualLab } from '@/types/virtual-lab/lab';
import { useUnwrappedValue } from '@/hooks/hooks';

type Props = {
  virtualLabId: string;
};

export default function VirtualLabSidebar({ virtualLabId }: Props) {
  const currentPage = usePathname().split('/').pop();
  const virtualLab = useAtomValue(getAtom<VirtualLab>('vlab'));
  const projects = useUnwrappedValue(virtualLabProjectsAtomFamily(virtualLabId));
  const users = useUnwrappedValue(virtualLabMembersAtomFamily(virtualLabId));

  const linkItems: LinkItem[] = [
    { key: LinkItemKey.Lab, content: 'Overview', href: 'overview' },
    {
      key: LinkItemKey.Projects,
      content: (
        <div className="flex justify-between">
          <span>Projects</span>
          <span className="font-normal text-primary-3">{projects?.results.length}</span>
        </div>
      ),
      href: 'projects',
    },
    {
      key: LinkItemKey.Team,
      content: (
        <div className="flex justify-between">
          <span>Team</span>
          <span className="font-normal text-primary-3">{users?.length}</span>
        </div>
      ),
      href: 'team',
    },
    { key: LinkItemKey.Admin, content: 'Admin', href: 'admin' },
  ];
  return (
    <div className="mr-5 flex w-full flex-col gap-5">
      <div className="text-5xl font-bold uppercase text-primary-5" style={{ minHeight: '84px' }}>
        {virtualLab?.name}
      </div>
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
