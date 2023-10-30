'use client';

import { ReactNode } from 'react';
import Sidebar from '@/components/explore-section/Sidebar';

type GenericLayoutProps = {
  children: ReactNode;
};

export default function ExploreListingLayout({ children }: GenericLayoutProps) {
  return (
    <div className="flex">
      <aside className="fixed z-50">
        <Sidebar />
      </aside>
      <main className="w-full pl-[35px]">{children}</main>
    </div>
  );
}
