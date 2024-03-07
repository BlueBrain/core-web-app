'use client';

import VerticalLinks, { LinkItem } from '@/components/VerticalLinks';

type Props = {
  current: string;
  basePath: string;
};

export default function VirtualLabSidebar({ current, basePath }: Props) {
  const linkItems: LinkItem[] = [
    { key: 'lab', content: 'The Virtual Lab', href: `${basePath}` },
    { key: 'projects', content: 'Projects', href: `${basePath}/projects` },
    { key: 'team', content: 'Team', href: `${basePath}/team` },
    { key: 'admin', content: 'Admin', href: `${basePath}/admin` },
  ];
  return <VerticalLinks links={linkItems} current={current} />;
}
