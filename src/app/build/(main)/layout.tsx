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

import styles from './build-section-main.module.css';

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

  useEffect(() => {
    setExtraPanelContainer(extraPanelRef.current);
  }, [setExtraPanelContainer]);

  return (
    <div className={styles.container}>
      <div className={styles.brainConfigSelectorContainer}>
        <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
          <BrainConfigPanel baseHref="/build/cell-composition/interactive" />
        </ErrorBoundary>
      </div>

      <div className={styles.brainSelectorContainer}>
        {!isConnectomeEditor && (
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

      <div className={styles.extraPanelContainer} ref={extraPanelRef} />

      <div className={styles.tabsContainer}>
        <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
          <TopTabs />
        </ErrorBoundary>
      </div>

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className={styles.contentContainer}>{children}</div>
      </ErrorBoundary>
    </div>
  );
}
