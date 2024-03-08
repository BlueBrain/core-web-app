'use client';

import { ReactNode, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSetAtom } from 'jotai';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import SideMenu from '@/components/SideMenu';
import { idAtom as brainModelConfigIdAtom } from '@/state/brain-model-config';
import { defaultModelRelease } from '@/config';

import { useSetBrainRegionFromQuery } from '@/hooks/brain-region-panel';
import { BrainRegionsSidebar } from '@/components/build-section/BrainRegionSelector';

export default function VirtualLabProjectInteractiveExploreLayout({
  children,
}: {
  children: ReactNode;
}) {
  const setConfigId = useSetAtom(brainModelConfigIdAtom);
  useSetBrainRegionFromQuery();

  // set Release 23.01 as the configuration of explore interactive
  useEffect(() => setConfigId(defaultModelRelease.id), [setConfigId]);

  return (
    <div className="grid h-screen grid-cols-[min-content_min-content_auto] grid-rows-1">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="flex flex-row gap-4">
          <SideMenu
            links={[
              {
                key: 'project',
                href: '/virtual-lab/lab/test/project/test',
                content: 'Name of the project',
              },
              {
                key: 'explore',
                href: '/virtual-lab/lab/test/project/test/explore',
                content: 'Explore',
              },
            ]}
            current="explore"
          />
        </div>
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <BrainRegionsSidebar />
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>{children}</ErrorBoundary>
    </div>
  );
}
