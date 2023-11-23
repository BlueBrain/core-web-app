'use client';

import { ReactNode, Suspense, useEffect, useRef } from 'react';
import { useSetAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';

import { BrainRegionsSidebar } from '@/components/build-section/BrainRegionSelector';
import BrainConfigPanel from '@/components/BrainConfigPanel';
import useBrainModelConfigState from '@/hooks/brain-model-config';
import TopTabs from '@/components/TopTabs';
import useAuth from '@/hooks/auth';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import ConnectomeEditorSidebar from '@/components/ConnectomeEditorSidebar';
import { extraPanelContainerAtom } from '@/state/build-section/layout';
import ContextualLiterature from '@/components/build-section/ContextualLiterature/Content';

type BuildSectionLayoutProps = {
  children: ReactNode;
};

export default function BuildSectionLayout({ children }: BuildSectionLayoutProps) {
  useBrainModelConfigState();
  useAuth(true);
  const extraPanelRef = useRef(null);
  const setExtraPanelContainer = useSetAtom(extraPanelContainerAtom);
  const path = usePathname();
  const isConnectomeEditor = !!path?.includes('connectome-definition');
  const isSynapseEditor = !!path?.includes('connectome-model-assignment');

  useEffect(() => {
    setExtraPanelContainer(extraPanelRef.current);
  }, [setExtraPanelContainer]);

  return (
    <div className="h-screen w-screen flex">
      <div className="shrink">
        <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
          <BrainConfigPanel baseHref="/build/cell-composition/interactive" />
        </ErrorBoundary>
      </div>

      <div className="shrink">
        {!isConnectomeEditor && !isSynapseEditor && (
          <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
            <DefaultLoadingSuspense>
              <BrainRegionsSidebar />
            </DefaultLoadingSuspense>
          </ErrorBoundary>
        )}
        {isConnectomeEditor && (
          <Suspense fallback={<div className="bg-black h-screen w-[40px]" />}>
            <ConnectomeEditorSidebar />
          </Suspense>
        )}
      </div>

      <div className="shrink" ref={extraPanelRef} />

      {/* min-width: 0 / min-height: 0 and overflow: hidden are needed when rendering a canvas inside */}
      <div className="grow min-w-0 min-h-0 overflow-hidden">
        <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
          <TopTabs />
        </ErrorBoundary>
        <ErrorBoundary FallbackComponent={SimpleErrorComponent}>{children}</ErrorBoundary>
      </div>

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <ContextualLiterature />
      </ErrorBoundary>
    </div>
  );
}
