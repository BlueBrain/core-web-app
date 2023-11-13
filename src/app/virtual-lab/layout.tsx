'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { ReactNode } from 'react';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import useAuth from '@/hooks/auth';
import VirtualLabSidebar from '@/components/VirtualLabSidebar';

export default function VirtualLabLayout({ children }: { children: ReactNode }) {
  useAuth(true);

  return (
    // TODO: Change background to include the brain image once Bilal's work is done
    <div className="bg-primary-9 text-white h-screen grid grid-cols-[min-content_min-content_auto] grid-rows-1 p-10">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <VirtualLabSidebar />
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>{children}</ErrorBoundary>
    </div>
  );
}
