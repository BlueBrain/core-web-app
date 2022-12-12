import React from 'react';
import { Tabs } from 'antd';
import { TabsProps } from 'antd/es/tabs';
import styles from './subnavigation-tabs.module.scss';

export default function SubnavigationTabs(props: TabsProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Tabs className={styles.subnavigationTabs} {...props} />;
}
