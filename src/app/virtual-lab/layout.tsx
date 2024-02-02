'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { ReactNode } from 'react';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import { basePath } from '@/config';
import VirtualLabSidebar from '@/components/VirtualLab/VirtualLabSettingsComponent/VirtualLabSidebar';

export default function VirtualLabLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="inset-0 z-0 grid h-screen grid-cols-[1fr_3fr] grid-rows-1 overflow-y-scroll bg-primary-9 bg-center bg-no-repeat p-10 text-white bg-blend-lighten [background-size:70%]"
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
