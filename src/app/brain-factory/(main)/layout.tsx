'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { useSetAtom } from 'jotai/react';
import { usePathname } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';

import { BrainRegionsSidebar } from '@/components/BrainRegionSelector';
import BrainConfigPanel from '@/components/BrainConfigPanel';
import useBrainModelConfigState from '@/hooks/brain-model-config';
import useSessionState from '@/hooks/session';
import TopTabs from '@/components/TopTabs';
import useAuth from '@/hooks/auth';
import { SimpleErrorComponent } from '@/components/GenericErrorFallback';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';
import BrainRegionSelector from '@/components/ConnectomeEditorSidebar/BrainRegionSelector';
import { extraPanelContainerAtom } from '@/state/brain-factory/layout';

import styles from './brain-factory-main.module.css';

type BrainFactoryLayoutProps = {
  children: ReactNode;
};

export default function BrainFactoryLayout({ children }: BrainFactoryLayoutProps) {
  useBrainModelConfigState();
  useSessionState();
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
          <BrainConfigPanel baseHref="/brain-factory/cell-composition/interactive" />
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
        {isConnectomeEditor && <BrainRegionSelector />}
      </div>

      <div className={styles.extraPanelContainer} ref={extraPanelRef} />

      <div className={styles.tabsContainer}>
        <TopTabs />
      </div>

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className={styles.contentContainer}>{children}</div>
      </ErrorBoundary>
    </div>
  );
}
