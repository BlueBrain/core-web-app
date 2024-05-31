'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { ReactNode } from 'react';
import { useSession } from 'next-auth/react';

import SimpleErrorComponent from '@/components/GenericErrorFallback';

export default function VirtualLabLayout({ children }: { children: ReactNode }) {
  useSession({ required: true });
  return (
    <div className="h-screen overflow-y-auto bg-primary-9 text-white">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>{children}</ErrorBoundary>
    </div>
  );
}
