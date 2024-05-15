'use client';

import { ErrorBoundary } from 'react-error-boundary';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import { BrainRegionsSidebar } from '@/components/build-section/BrainRegionSelector';
import { useSetBrainRegionFromQuery } from '@/hooks/brain-region-panel';
import { LabProjectLayoutProps } from '@/types/virtual-lab/layout';

export default function GenericLayout({ children }: LabProjectLayoutProps) {
  useSetBrainRegionFromQuery();

  return (
    <div className="grid h-screen grid-cols-[min-content_auto] grid-rows-1">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <BrainRegionsSidebar />
      </ErrorBoundary>
      <div className="bg-white">{children}</div>
    </div>
  );
}
