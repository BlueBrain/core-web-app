import React from 'react';
import { Tabs } from 'antd';
import { TabsProps } from 'antd/es/tabs';
import styles from './content-tabs.module.scss';

export default function ContentTabs(props: TabsProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Tabs type="card" className={styles.contentTabs} {...props} />;
}
