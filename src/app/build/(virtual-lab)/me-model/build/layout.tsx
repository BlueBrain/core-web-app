'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import Nav from '@/components/build-section/virtual-lab/me-model/Nav';
import { BrainRegionsSidebar } from '@/components/build-section/BrainRegionSelector';
import ModelTypeTab from '@/components/build-section/virtual-lab/me-model/ModelTypeTab';

type GenericLayoutProps = {
  children: ReactNode;
};

export default function BuildMEModelLayout({ children }: GenericLayoutProps) {
  return (
    <div className="grid grid-cols-[min-content_min-content_auto]">
      <Nav />

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <BrainRegionsSidebar />
      </ErrorBoundary>

      <div className="flex flex-col">
        <ModelTypeTab />
        <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
          <div className="flex h-full flex-col">{children}</div>
        </ErrorBoundary>
      </div>
    </div>
  );
}
