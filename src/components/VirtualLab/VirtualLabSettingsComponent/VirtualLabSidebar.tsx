'use client';

import { usePathname } from 'next/navigation';

import VerticalLinks, { LinkItem } from '@/components/VerticalLinks';

export default function VirtualLabSidebar() {
  const currentPage = usePathname().split('/').pop();

  const linkItems: LinkItem[] = [
    { key: 'lab', content: 'The Virtual Lab', href: 'lab' },
    { key: 'projects', content: 'Projects', href: 'projects' },
    { key: 'team', content: 'Team', href: 'team' },
    { key: 'admin', content: 'Admin', href: 'admin' },
  ];
  return (
    <div className="flex flex-col gap-5">
      <div className="text-5xl font-bold uppercase text-primary-5">Institute of Neuroscience</div>
      <VerticalLinks links={linkItems} currentPage={currentPage} />
    </div>
  );
}
