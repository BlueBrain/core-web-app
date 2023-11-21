import React from 'react';

import { classNames } from '@/util/utils';

import styles from './header.module.css';

export interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <div className={classNames(styles.main, className)}>
      <div>Create</div>
      <h1>Virtual lab</h1>
    </div>
  );
}
