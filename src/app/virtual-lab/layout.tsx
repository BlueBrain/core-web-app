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
    <div className="bg-primary-9 text-white h-screen grid grid-cols-[1fr_3fr] grid-rows-1 p-10 overflow-y-scroll">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <VirtualLabSidebar />
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>{children}</ErrorBoundary>
    </div>
  );
}
