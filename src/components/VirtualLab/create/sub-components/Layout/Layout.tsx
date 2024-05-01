import React from 'react';

import { useCurrentVirtualLab } from '../../hooks/current-virtual-lab';
import { VirtualLabCreateCongrats } from '../Congrats';
import commonStyles from '../../common.module.css';
import { classNames } from '@/util/utils';
import styles from './layout.module.css';

export interface LayoutProps {
  className?: string;
  children: JSX.Element;
}

export function Layout({ className, children }: LayoutProps) {
  const [lab] = useCurrentVirtualLab();
  return (
    <div className={classNames(styles.main, commonStyles.theme, className)}>
      {lab.id ? <VirtualLabCreateCongrats /> : children}
    </div>
  );
}
