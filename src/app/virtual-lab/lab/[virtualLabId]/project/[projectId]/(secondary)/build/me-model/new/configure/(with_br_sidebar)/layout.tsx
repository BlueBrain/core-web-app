'use client';

import { ReactNode, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSetAtom } from 'jotai';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import { BrainRegionsSidebar } from '@/components/build-section/BrainRegionSelector';
import { sectionAtom } from '@/state/application';

type GenericLayoutProps = {
  children: ReactNode;
};

export default function BuildMEModelLayout({ children }: GenericLayoutProps) {
  const setSection = useSetAtom(sectionAtom);

  useEffect(() => setSection('build'), [setSection]);

  return (
    <div className="grid grid-cols-[min-content_auto] bg-white">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <BrainRegionsSidebar scope="build" />
      </ErrorBoundary>

      <div className="flex flex-col">
        <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
          <div className="flex h-full flex-col p-10">{children}</div>
        </ErrorBoundary>
      </div>
    </div>
  );
}
