'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { ReactNode, useEffect } from 'react';
import { useSetAtom } from 'jotai';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import { BrainRegionsSidebar } from '@/components/build-section/BrainRegionSelector';
import Sidebar from '@/components/explore-section/Sidebar';
import { idAtom as brainModelConfigIdAtom } from '@/state/brain-model-config';
import useAuth from '@/hooks/auth';

const RELEASE_23_01_CONFIG_ID =
  'https://bbp.epfl.ch/neurosciencegraph/data/modelconfigurations/1921aaae-69c4-4366-ae9d-7aa1453f2158';

export default function ExploreInteractiveLayout({ children }: { children: ReactNode }) {
  const setConfig = useSetAtom(brainModelConfigIdAtom);

  // set Release 23.01 as the configuration of explore interactive
  useEffect(() => setConfig(RELEASE_23_01_CONFIG_ID), [setConfig]);

  useAuth(true);

  return (
    <div className="h-screen grid grid-cols-[min-content_min-content_auto] grid-rows-1 ">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <Sidebar />
      </ErrorBoundary>
      <div>
        <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
          <DefaultLoadingSuspense>
            <BrainRegionsSidebar />
          </DefaultLoadingSuspense>
        </ErrorBoundary>
      </div>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>{children}</ErrorBoundary>
    </div>
  );
}
