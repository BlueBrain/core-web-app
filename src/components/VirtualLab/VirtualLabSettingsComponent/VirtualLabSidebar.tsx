'use client';

import { usePathname } from 'next/navigation';

import VerticalLinks, { LinkItem } from '@/components/VerticalLinks';

export default function VirtualLabSidebar() {
  const currentPage = usePathname().split('/').pop();

  const linkItems: LinkItem[] = [
    { key: 'lab', content: 'The Virtual Lab', href: `lab` },
    { key: 'projects', content: 'Projects', href: `projects` },
    { key: 'team', content: 'Team', href: `team` },
    { key: 'admin', content: 'Admin', href: `admin` },
  ];
  return <VerticalLinks links={linkItems} currentPage={currentPage} />;
}
