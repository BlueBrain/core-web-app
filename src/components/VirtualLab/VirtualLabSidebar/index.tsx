'use client';

import { usePathname } from 'next/navigation';
import VirtualLabsSelect from './VirtualLabsSelect';
import VerticalLinks, { LinkItem } from '@/components/VerticalLinks';

export default function VirtualLabSidebar() {
  const currentPage = usePathname().split('/').pop();

  const linkItems: LinkItem[] = [
    { key: 'lab', content: 'The Virtual Lab', href: 'lab' },
    {
      key: 'projects',
      content: (
        <div className="flex justify-between">
          <span>Projects</span>
          <span className="font-normal text-primary-3">9</span>
        </div>
      ),
      href: 'projects',
    },
    {
      key: 'team',
      content: (
        <div className="flex justify-between">
          <span>Team</span>
          <span className="font-normal text-primary-3">23 members</span>
        </div>
      ),
      href: 'team',
    },
    { key: 'admin', content: 'Admin', href: 'admin' },
  ];
  return (
    <div className="mr-12 flex flex-col gap-5">
      <div className="text-5xl font-bold uppercase text-primary-5">Institute of Neuroscience</div>
      <VirtualLabsSelect />
      <VerticalLinks links={linkItems} currentPage={currentPage} />
    </div>
  );
}
