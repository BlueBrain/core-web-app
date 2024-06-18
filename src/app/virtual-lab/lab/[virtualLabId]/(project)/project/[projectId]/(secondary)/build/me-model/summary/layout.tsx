'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import Nav from '@/components/build-section/virtual-lab/me-model/Nav';

type GenericLayoutProps = {
  children: ReactNode;
  params: { virtualLabId: string; projectId: string };
};

export default function BuildMEModelSummaryLayout({ children, params }: GenericLayoutProps) {
  return (
    <div className="grid grid-cols-[min-content_auto]">
      <Nav params={params} />

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="flex h-full flex-col">{children}</div>
      </ErrorBoundary>
    </div>
  );
}
