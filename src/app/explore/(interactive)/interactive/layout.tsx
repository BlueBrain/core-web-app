'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { ReactNode } from 'react';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import { BrainRegionsSidebar } from '@/components/build-section/BrainRegionSelector';
import Sidebar from '@/components/explore-section/Sidebar';
import SelectedBrainRegionPanel from '@/components/explore-section/ExploreInteractive/SelectedBrainRegionPanel';

export default function ExploreInteractiveLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen grid grid-cols-[min-content_min-content_auto] grid-rows-1 ">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <Sidebar />
      </ErrorBoundary>
      <div>
        <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
          <DefaultLoadingSuspense>
            <BrainRegionsSidebar />
          </DefaultLoadingSuspense>
        </ErrorBoundary>
      </div>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="relative">
          {children}
          <SelectedBrainRegionPanel />
        </div>
      </ErrorBoundary>
    </div>
  );
}
