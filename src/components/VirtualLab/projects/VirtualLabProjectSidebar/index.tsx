'use client';

import { usePathname } from 'next/navigation';
import VerticalLinks, { LinkItem } from '@/components/VerticalLinks';

export default function VirtualLabProjectSidebar() {
  const currentPage = usePathname().split('/').pop();
  const linkItems: LinkItem[] = [
    { key: 'home', content: 'Project Home', href: 'home' },
    { key: 'library', content: 'Project Library', href: 'library' },
    { key: 'team', content: 'Project Team', href: 'team' },
    { key: 'explore', content: 'Explore', href: 'explore' },
    { key: 'build', content: 'Build', href: 'build' },
    { key: 'simulate', content: 'Simulate', href: 'simulate' },
  ];
  return (
    <div className="mt-10">
      <h1 className="leading-12 mb-5 text-5xl font-bold uppercase">
        Thalamus <br />
        Exploration <br />
        Project 1
      </h1>

      <VerticalLinks links={linkItems} currentPage={currentPage} />
    </div>
  );
}
