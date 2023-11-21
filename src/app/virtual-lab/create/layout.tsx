'use client';

import { ReactNode } from 'react';

import { ArrowLeftIcon } from '@/components/icons';

import styles from './layout.module.css';

export default function CreateLabLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.layout}>
      <header>
        <ArrowLeftIcon /> <div>Back to...</div>
      </header>
      {children}
    </div>
  );
}
