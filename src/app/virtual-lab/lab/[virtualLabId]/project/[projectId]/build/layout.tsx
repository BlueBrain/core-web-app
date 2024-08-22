'use client';

import { ErrorBoundary } from 'react-error-boundary';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import VirtualLabProjectSidebar from '@/components/VirtualLab/projects/VirtualLabProjectSidebar';
import { LabProjectLayoutProps } from '@/types/virtual-lab/layout';
import Nav from '@/components/build-section/virtual-lab/me-model/Nav';

export default function VirtualLabProjectLayout({ children, params }: LabProjectLayoutProps) {
  return (
    <div className="flex overflow-scroll bg-primary-9 pr-5 text-white">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="flex h-screen w-1/4 flex-row gap-4">
          <Nav params={params} />

          <VirtualLabProjectSidebar
            virtualLabId={params.virtualLabId}
            projectId={params.projectId}
          />
        </div>
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="flex h-screen w-3/4 flex-col gap-10 overflow-y-auto">{children}</div>
      </ErrorBoundary>
    </div>
  );
}
