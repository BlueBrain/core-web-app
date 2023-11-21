import React from 'react';

import { Header } from '../Header';
import { useCurrentVirtualLab } from '../../hooks/current-virtual-lab';
import { VirtualLabCreateCongrats } from '../Congrats';
import { classNames } from '@/util/utils';

import styles from './layout.module.css';
// eslint-disable-next-line import/order
import commonStyles from '../../common.module.css';

export interface LayoutProps {
  className?: string;
  children: JSX.Element;
}

export function Layout({ className, children }: LayoutProps) {
  const [lab] = useCurrentVirtualLab();
  return (
    <div className={classNames(styles.main, commonStyles.theme, className)}>
      <Header />
      {lab.id ? <VirtualLabCreateCongrats /> : children}
    </div>
  );
}
