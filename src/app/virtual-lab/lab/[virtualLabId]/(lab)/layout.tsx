'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import VirtualLabSidebar from '@/components/VirtualLab/VirtualLabSettingsComponent/VirtualLabSidebar';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';
import useBasePath from '@/hooks/useBasePath';

export default function VirtualLabPageLayout({ children }: { children: ReactNode }) {
  const [path, current] = useBasePath('lab');
  return (
    <div className="inset-0 z-0 m-10 grid h-screen grid-cols-[1fr_3fr] grid-rows-1 overflow-y-scroll bg-primary-9 bg-center bg-no-repeat pr-10 text-white bg-blend-lighten [background-size:70%]">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="flex flex-row gap-4">
          <VirtualLabSidebar basePath={path} current={current} />
        </div>
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div>
          <VirtualLabTopMenu />
          {children}
        </div>
      </ErrorBoundary>
    </div>
  );
}
