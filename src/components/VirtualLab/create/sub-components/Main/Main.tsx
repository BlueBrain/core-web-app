import React, { ReactNode } from 'react';

import { STEPS } from '../../constants';
import { NavButtons } from '../NavButtons';
import { classNames } from '@/util/utils';

import styles from './main.module.css';

export interface MainProps {
  className?: string;
  canGoNext: boolean;
  step: keyof typeof STEPS;
  children: ReactNode;
  onNext: () => void;
}

export function Main({ className, canGoNext, step, children, onNext }: MainProps) {
  return (
    <div className={classNames(styles.main, className)}>
      <div>{children}</div>
      <footer>
        <NavButtons disabled={!canGoNext} step={step} onNext={onNext} />
      </footer>
    </div>
  );
}
