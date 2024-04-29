import React, { ReactNode } from 'react';

import { NavButtons } from '../NavButtons';
import { classNames } from '@/util/utils';

import styles from './main.module.css';

export interface MainProps {
  className?: string;
  canGoNext: boolean;
  step: string;
  children: ReactNode;
}

export function Main({ className, canGoNext, step, children }: MainProps) {
  return (
    <div className={classNames(styles.main, className)}>
      <div>{children}</div>
      <footer>
        <NavButtons disabled={!canGoNext} step={step} />
      </footer>
    </div>
  );
}
