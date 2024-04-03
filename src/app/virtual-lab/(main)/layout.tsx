'use client';

import { ReactNode } from 'react';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';
import { basePath } from '@/config';

export default function MainVirtualLabLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative flex h-full flex-col p-6"
      style={{
        position: 'relative', // Ensure the container is positioned relative
      }}
    >
      <div
        className="absolute left-[65%] h-[2469px] w-[2046px] rotate-[-90deg] transform bg-cover bg-right-top bg-no-repeat"
        style={{
          backgroundImage: `url(${basePath}/images/obp_hippocampus.png)`,
          backgroundSize: '75%', // Ensure the background covers the entire container
        }}
      />
      <div className="flex w-full justify-between">
        <div className="w-[100px] text-3xl font-bold">Open Brain Platform</div>
        <VirtualLabTopMenu />
      </div>
      {children}
    </div>
  );
}
