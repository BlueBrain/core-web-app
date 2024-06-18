'use client';

import { ReactNode } from 'react';

import ScopeCarousel from '@/components/VirtualLab/ScopeCarousel';

export default function VirtualLabProjectSimulateLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScopeCarousel />
      {children}
    </>
  );
}
