'use client';

import { ReactNode } from 'react';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';

export default function MainVirtualLabLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full flex-col p-6">
      <div className="flex w-full justify-between">
        <div className="w-[100px] text-3xl font-bold">Open Brain Platform</div>
        <VirtualLabTopMenu />
      </div>
      {children}
    </div>
  );
}
