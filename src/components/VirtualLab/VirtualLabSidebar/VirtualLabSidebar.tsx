'use client';

import { usePathname } from 'next/navigation';
import { SwapOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useHydrateAtoms } from 'jotai/utils';
import { virtualLabMembersAtomFamily } from '@/state/virtual-lab/lab';
import { virtualLabProjectsAtomFamily } from '@/state/virtual-lab/projects';
import VerticalLinks, { LinkItem } from '@/components/VerticalLinks';
import { LinkItemKey } from '@/constants/virtual-labs/sidemenu';
import { getAtom } from '@/state/state';

import { VirtualLab } from '@/types/virtual-lab/lab';
import { useUnwrappedValue } from '@/hooks/hooks';
import { useAtomValue } from 'jotai';

export default function VirtualLabSidebar({ initialVlab }: { initialVlab: VirtualLab }) {
  const currentPage = usePathname().split('/').pop();
  const vlabAtom = getAtom<VirtualLab>('vlab');

  useHydrateAtoms([[vlabAtom, initialVlab]]);
  const vlab = useAtomValue(vlabAtom) as VirtualLab;

  const projects = useUnwrappedValue(virtualLabProjectsAtomFamily(vlab.id));
  const users = useUnwrappedValue(virtualLabMembersAtomFamily(vlab.id))?.length;

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
      <div className="text-5xl font-bold uppercase text-primary-5" style={{ minHeight: '84px' }}>
        {vlab.name}
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
