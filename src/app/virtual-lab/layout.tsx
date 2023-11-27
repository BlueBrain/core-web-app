'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { ReactNode } from 'react';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import { basePath } from '@/config';
import VirtualLabSidebar from '@/components/VirtualLab/VirtualLabSettingsComponent/VirtualLabSidebar';

export default function VirtualLabLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="text-white h-screen grid grid-cols-[1fr_3fr] grid-rows-1 p-10 bg-primary-9 inset-0 z-0 bg-blend-lighten bg-no-repeat bg-center [background-size:70%] overflow-y-scroll"
      style={{
        backgroundImage: `url(${basePath}/images/obp_fullbrain_backdroped.png)`,
      }}
    >
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <VirtualLabSidebar />
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>{children}</ErrorBoundary>
    </div>
  );
}
