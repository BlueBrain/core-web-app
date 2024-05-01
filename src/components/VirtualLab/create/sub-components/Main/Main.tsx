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
  const validChildren = React.Children.toArray(children).filter(Boolean); // Remove falsy / 0 from children

  return (
    <div className={classNames(styles.main, className)}>
      <div>{validChildren}</div>
      <footer>
        <NavButtons disabled={!canGoNext} step={step} />
      </footer>
    </div>
  );
}
