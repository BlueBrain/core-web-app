'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import ExploreListingLayout from '@/components/explore-section/ExploreListingLayout';

type GenericLayoutProps = {
  children: ReactNode;
};

export default function GenericLayout({ children }: GenericLayoutProps) {
  return (
    <div className="h-screen overflow-hidden" id="simulation-campaigns-layout">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <ExploreListingLayout>{children}</ExploreListingLayout>
      </ErrorBoundary>
    </div>
  );
}
