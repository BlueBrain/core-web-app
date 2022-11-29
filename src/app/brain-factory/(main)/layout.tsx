'use client';

import { ReactNode } from 'react';
import { useAtomValue } from 'jotai';

import BrainRegionSelector from '@/components/BrainRegionSelector';
import Tabs from '@/components/BrainFactoryTabs';
import BuildModelBtn from '@/components/BuildModelBtn';
import { themeAtom } from '@/state/theme';

import styles from './brain-factory-main.module.css';

type BrainFactoryLayoutProps = {
  children: ReactNode;
};

export default function BrainFactoryLayout({ children }: BrainFactoryLayoutProps) {
  const theme = useAtomValue(themeAtom);

  const bgClassName = theme === 'light' ? styles.bgThemeLight : styles.bgThemeDark;

  return (
    <div className={styles.container}>
      <div className={styles.brainSelectorContainer}>
        <BrainRegionSelector />
      </div>

      <div className={`${styles.tabsContainer} ${bgClassName}`}>
        <Tabs>
          <BuildModelBtn />
        </Tabs>
      </div>

      <div className={`${styles.contentContainer} ${bgClassName}`}>{children}</div>
    </div>
  );
}
