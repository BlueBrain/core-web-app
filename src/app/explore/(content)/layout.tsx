'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import useAuth from '@/hooks/auth';
import SimpleErrorComponent from '@/components/GenericErrorFallback';

import ExploreListingLayout from '@/components/explore-section/ExploreListingLayout';

type GenericLayoutProps = {
  children: ReactNode;
};

export default function GenericLayout({ children }: GenericLayoutProps) {
  useAuth(true);

  return (
    <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
      <ExploreListingLayout>{children}</ExploreListingLayout>
    </ErrorBoundary>
  );
}
