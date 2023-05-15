'use client';

import { ReactNode } from 'react';
import Sidebar from '@/components/explore-section/Sidebar';
import styles from '@/components/explore-section/Sidebar/sidebar.module.scss';

type GenericLayoutProps = {
  children: ReactNode;
};

export default function ExploreListingLayout({ children }: GenericLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <aside>
        <Sidebar />
      </aside>
      <main>{children}</main>
    </div>
  );
}
