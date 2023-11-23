'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { ReactNode, useEffect } from 'react';
import { useSetAtom } from 'jotai';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
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
    <div className="h-screen w-screen flex">
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="shrink">
          <Sidebar />
        </div>
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="shrink">
          <BrainRegionsSidebar />
        </div>
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        {/* min-width: 0 / min-height: 0 and overflow: hidden are needed when rendering a canvas inside */}
        <div className="grow min-w-0 min-h-0 overflow-hidden">{children}</div>
      </ErrorBoundary>
    </div>
  );
}
