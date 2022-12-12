import React from 'react';
import { Tab } from 'rc-tabs/es/interface'; // eslint-disable-line import/no-extraneous-dependencies
import SubnavigationTabs from '@/components/tabs/SubnavigationTabs';
import CellDensity from '@/components/configuration-view/cell-density/CellDensity';
import CellDistribution from '@/components/configuration-view/cell-distribution/CellDistribution';
import CellPosition from '@/components/configuration-view/cell-position/CellPosition';

import styles from './cell-composition.module.scss';

function getTabItems() {
  return [
    {
      label: 'Density',
      key: 'density',
      children: <CellDensity />,
    },
    { label: 'Distribution', key: 'distribution', children: <CellDistribution /> },
    { label: 'Position', key: 'position', children: <CellPosition /> },
  ];
}

export default function CellComposition() {
  const tabItems: Tab[] = getTabItems();

  return (
    <div className={styles.cellComposition}>
      <SubnavigationTabs items={tabItems} />
    </div>
  );
}
