import React from 'react';
import { classNames } from '@/util/utils';

import styles from './dendrogram-switch.module.css';

export interface DendrogramSwitchProps {
  className?: string;
  visible: boolean;
  value: '2d' | '3d';
  onChange(value: '2d' | '3d'): void;
}

export function DendrogramSwitch({ className, visible, value, onChange }: DendrogramSwitchProps) {
  return (
    <div className={classNames(styles.main, className, visible ? styles.show : styles.hide)}>
      <div>View</div>
      <button type="button" onClick={() => onChange(value === '2d' ? '3d' : '2d')}>
        <div className={classNames(value === '2d' && styles.selected)}>Dendrogram</div>
        <div className={classNames(value === '3d' && styles.selected)}>3D</div>
      </button>
    </div>
  );
}
