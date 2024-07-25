'use client';

import { usePathname } from 'next/navigation';
import { useAtomValue } from 'jotai';
import { virtualLabMembersAtomFamily } from '@/state/virtual-lab/lab';
import { virtualLabProjectsAtomFamily } from '@/state/virtual-lab/projects';
import VerticalLinks, { LinkItem } from '@/components/VerticalLinks';
import { LinkItemKey } from '@/constants/virtual-labs/sidemenu';
import { useInitAtom } from '@/state/state';
import { VirtualLab } from '@/types/virtual-lab/lab';
import { useUnwrappedValue } from '@/hooks/hooks';

export function VirtualLabSidebarTitle({ name }: { name: string }) {
  return (
    <div className="text-5xl font-bold uppercase text-primary-5" style={{ minHeight: '84px' }}>
      {name}
    </div>
  );
}

export default function VirtualLabSidebarContent({ initialVlab }: { initialVlab: VirtualLab }) {
  const currentPage = usePathname().split('/').pop();
  const vlabAtom = useInitAtom<VirtualLab>(initialVlab.id, initialVlab);

  const vlab = useAtomValue(vlabAtom) as VirtualLab;

  const projects = useUnwrappedValue(virtualLabProjectsAtomFamily(vlab?.id));
  const users = useUnwrappedValue(virtualLabMembersAtomFamily(vlab?.id))?.length;

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
  return <VerticalLinks links={linkItems} currentPage={currentPage} />;
}
