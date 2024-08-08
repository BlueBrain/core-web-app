'use client';

import { ErrorBoundary } from 'react-error-boundary';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';
import VirtualLabProjectSidebar from '@/components/VirtualLab/projects/VirtualLabProjectSidebar';
import { LabProjectLayoutProps } from '@/types/virtual-lab/layout';
import Nav from '@/components/build-section/virtual-lab/me-model/Nav';

export default function VirtualLabProjectLayout({ children, params }: LabProjectLayoutProps) {
  return (
    <div className="grid h-screen grid-cols-[1fr_3fr] grid-rows-1 bg-primary-9 pr-5 text-white">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="flex flex-row gap-4">
          <Nav params={params} />

          <VirtualLabProjectSidebar
            virtualLabId={params.virtualLabId}
            projectId={params.projectId}
          />
        </div>
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="mt-8 flex w-full flex-col gap-10 overflow-y-auto overflow-x-hidden">
          <VirtualLabTopMenu />
          {children}
        </div>
      </ErrorBoundary>
    </div>
  );
}
