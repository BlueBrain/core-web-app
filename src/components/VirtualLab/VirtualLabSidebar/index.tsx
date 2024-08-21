'use client';

import { usePathname } from 'next/navigation';
import { virtualLabDetailAtomFamily, virtualLabMembersAtomFamily } from '@/state/virtual-lab/lab';
import { virtualLabProjectsAtomFamily } from '@/state/virtual-lab/projects';
import VerticalLinks, { LinkItem } from '@/components/VerticalLinks';
import { LinkItemKey } from '@/constants/virtual-labs/sidemenu';
import { useUnwrappedValue } from '@/hooks/hooks';

export default function VirtualLabSidebarContent({
  virtualLabId,
  showTitle = false,
}: {
  virtualLabId: string;
  showTitle?: boolean;
}) {
  const currentPage = usePathname().split('/').pop();

  const vlab = useUnwrappedValue(virtualLabDetailAtomFamily(virtualLabId));
  const projects = useUnwrappedValue(virtualLabProjectsAtomFamily(virtualLabId));
  const users = useUnwrappedValue(virtualLabMembersAtomFamily(virtualLabId))?.length;

  const linkItems: LinkItem[] = [
    { key: LinkItemKey.Lab, content: 'Virtual lab overview', href: 'overview' },
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
          {users !== undefined && (
            <span className="font-normal text-primary-3">{`${users} member${users !== 1 ? 's' : ''}`}</span>
          )}
        </div>
      ),
      href: 'team',
    },
    { key: LinkItemKey.Admin, content: 'Admin', href: 'admin' },
  ];

  return (
    <div className="mr-5 flex w-full flex-col gap-5">
      {showTitle && vlab && (
        <div className="text-5xl font-bold uppercase text-primary-5" style={{ minHeight: '84px' }}>
          {vlab.name}
        </div>
      )}
      <VerticalLinks links={linkItems} currentPage={currentPage} />
    </div>
  );
}
