'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';

export default function VirtualLabPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen overflow-y-scroll bg-primary-9 p-10 text-white">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col text-2xl font-bold">
          <span>Open</span> <span> Brain</span> <span>Platform</span>
        </div>
        <VirtualLabTopMenu />
      </div>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="mt-6">{children}</div>
      </ErrorBoundary>
    </div>
  );
}
