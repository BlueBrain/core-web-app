'use client';

import { ReactNode, Suspense } from 'react';

import { ConnectomeDefinitionTabs, GranularityTabs } from '@/components/connectome-definition';

import styles from './connectome-definition.module.css';

type ConnectomeDefinitionLayoutProps = {
  children: ReactNode;
};

export default function ConnectomeDefinitionLayout({ children }: ConnectomeDefinitionLayoutProps) {
  return (
    <div className={styles.container}>
      <GranularityTabs />

      <div className={styles.viewTabs}>
        <ConnectomeDefinitionTabs />
      </div>

      <Suspense fallback={null}>{children}</Suspense>
    </div>
  );
}
