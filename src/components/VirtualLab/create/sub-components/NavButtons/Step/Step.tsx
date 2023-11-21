import React from 'react';
import { classNames } from '@/util/utils';

import styles from './step.module.css';

export interface StepProps {
  className?: string;
  selected?: boolean;
}

export function Step({ className, selected = false }: StepProps) {
  return <div className={classNames(styles.main, className, selected && styles.selected)} />;
}
