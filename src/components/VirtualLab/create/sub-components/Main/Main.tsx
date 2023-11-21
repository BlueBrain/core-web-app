import React, { ReactNode } from 'react';

import { STEPS } from '../../constants';
import { NavButtons } from '../NavButtons';
import { classNames } from '@/util/utils';

import styles from './main.module.css';

export interface MainProps {
  className?: string;
  nextPage: string;
  canGoNext: boolean;
  step: keyof typeof STEPS;
  children: ReactNode;
}

export function Main({ className, canGoNext, nextPage, step, children }: MainProps) {
  return (
    <div className={classNames(styles.main, className)}>
      <div>{children}</div>
      <footer>
        <NavButtons disabled={!canGoNext} nextPage={nextPage} step={step} />
      </footer>
    </div>
  );
}
