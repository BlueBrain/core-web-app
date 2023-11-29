'use client';

import { ReactNode } from 'react';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@/components/icons';
import styles from './layout.module.css';

export default function CreateLabLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <div className={styles.layout}>
      <header>
        <ArrowLeftIcon />{' '}
        <button onClick={() => router.back()} type="button">
          Back to...
        </button>
      </header>
      {children}
    </div>
  );
}
