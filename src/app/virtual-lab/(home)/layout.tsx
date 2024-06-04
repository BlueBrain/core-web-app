'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import VirtualLabTopMenu from '@/components/VirtualLab/VirtualLabTopMenu';
import { OBPLogo } from '@/components/Entrypoint/segments/Splash';
import { useAuthenticatedRoute } from '@/hooks/server-safe-hooks';

export default function VirtualLabPageLayout({ children }: { children: ReactNode }) {
  const session = useAuthenticatedRoute();
  if (!session) return null; // Avoids pre-rendering the content during ssr

  conso
  return (
    <div className="bg-primary-9 p-10 text-white">
      <div className="flex flex-row justify-between">
        <OBPLogo color="text-white" />
        <VirtualLabTopMenu />
      </div>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>{children}</ErrorBoundary>
    </div>
  );
}
