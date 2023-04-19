'use client';

import { ReactNode } from 'react';

import { ConnectomeDefinitionTabs } from '@/components/connectome-definition';

import styles from './connectome-definition.module.css';

type ConnectomeDefinitionLayoutProps = {
  children: ReactNode;
};

export default function ConnectomeDefinitionLayout({ children }: ConnectomeDefinitionLayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.viewTabs}>
        <ConnectomeDefinitionTabs />
      </div>

      {children}
    </div>
  );
}
