import * as React from 'react';
import { classNames } from '@/util/utils';
import Styles from './how-to-use.module.css';

export interface HowToUseProps {
  className?: string;
  onClick(): void;
}

export default function HowToUse({ className, onClick }: HowToUseProps) {
  return (
    <button className={classNames(Styles.howToUse, className)} type="button" onClick={onClick}>
      How to use
    </button>
  );
}
