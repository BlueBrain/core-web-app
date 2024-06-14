'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import Nav from '@/components/build-section/virtual-lab/me-model/Nav';

type GenericLayoutProps = {
  children: ReactNode;
};

export default function BuildMEModelSummaryLayout({ children }: GenericLayoutProps) {
  return (
    <div className="grid grid-cols-[min-content_auto]">
      <Nav />

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="flex h-full flex-col">{children}</div>
      </ErrorBoundary>
    </div>
  );
}
