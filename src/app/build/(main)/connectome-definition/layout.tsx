'use client';

import { ReactNode, Suspense } from 'react';

import { ConnectomeDefinitionTabs, GranularityTabs } from '@/components/connectome-definition';
import usePathname from '@/hooks/pathname';

import styles from './connectome-definition.module.css';

type ConnectomeDefinitionLayoutProps = {
  children: ReactNode;
};

export default function ConnectomeDefinitionLayout({ children }: ConnectomeDefinitionLayoutProps) {
  const path = usePathname();
  const isLiteratureTab = path?.endsWith('/literature');

  return (
    <div className={isLiteratureTab ? styles.literature : styles.container}>
      {!isLiteratureTab && <GranularityTabs />}
      <div className={styles.viewTabs}>
        <ConnectomeDefinitionTabs />
      </div>

      <Suspense fallback={null}>{children}</Suspense>
    </div>
  );
}
