'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import VirtualLabSidebar from '@/components/VirtualLab/VirtualLabSettingsComponent/VirtualLabSidebar';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';

export default function VirtualLabPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="inset-0 z-0 m-10 grid h-screen grid-cols-[1fr_3fr] grid-rows-1 overflow-y-scroll bg-primary-9 bg-center text-white">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="flex flex-row gap-4">
          <VirtualLabSidebar />
        </div>
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="mx-10">
          <VirtualLabTopMenu />
          {children}
        </div>
      </ErrorBoundary>
    </div>
  );
}
