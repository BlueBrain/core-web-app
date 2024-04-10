'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';

export default function VirtualLabPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="inset-0 z-0 grid h-screen grid-cols-[1fr_3fr] grid-rows-1 overflow-y-scroll bg-primary-9 p-10 text-white">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="flex flex-col text-4xl font-bold">
          <span>Open</span> <span> Brain</span> <span>Platform</span>
        </div>
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="ml-6">
          <VirtualLabTopMenu />
          <div className="mt-6">{children}</div>
        </div>
      </ErrorBoundary>
    </div>
  );
}