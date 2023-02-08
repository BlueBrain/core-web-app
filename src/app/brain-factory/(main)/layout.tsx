'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BrainRegionsSidebar, RegionDetailsSidebar } from '@/components/BrainRegionSelector';
import BrainConfigPanel from '@/components/BrainConfigPanel';
import useBrainModelConfigState from '@/hooks/brain-model-config';
import useSessionState from '@/hooks/session';
import TopTabs from '@/components/TopTabs';
import useAuth from '@/hooks/auth';
import { SimpleErrorComponent } from '@/components/GenericErrorFallback';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';

import styles from './brain-factory-main.module.css';

type BrainFactoryLayoutProps = {
  children: ReactNode;
};

export default function BrainFactoryLayout({ children }: BrainFactoryLayoutProps) {
  useBrainModelConfigState();
  useSessionState();
  useAuth(true);

  return (
    <div className={styles.container}>
      <div className={styles.brainConfigSelectorContainer}>
        <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
          <BrainConfigPanel baseHref="/brain-factory/cell-composition/interactive" />
        </ErrorBoundary>
      </div>

      <div className={styles.brainSelectorContainer}>
        <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
          <div className="flex">
            <DefaultLoadingSuspense>
              <BrainRegionsSidebar />
            </DefaultLoadingSuspense>

            <RegionDetailsSidebar />
          </div>
        </ErrorBoundary>
      </div>

      <div className={styles.tabsContainer}>
        <TopTabs />
      </div>

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className={styles.contentContainer}>{children}</div>
      </ErrorBoundary>
    </div>
  );
}
