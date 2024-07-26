'use client';

import { ReactNode } from 'react';

import ScopeSelector from '@/components/VirtualLab/ScopeSelector';

export default function VirtualLabProjectSimulateLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScopeSelector />
      {children}
    </>
  );
}
