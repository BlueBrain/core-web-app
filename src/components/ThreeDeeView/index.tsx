'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { Layout } from 'antd';
import threeCtxWrapper from '@/visual/ThreeCtxWrapper';
import RootMeshContainer from '@/components/RootMeshContainer';
import styles from './styles.module.css';

const { Content } = Layout;

export default function ThreeDeeView() {
  const [ready, isReady] = useState(false);
  const threeDeeDiv = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (threeDeeDiv.current !== null) {
      threeCtxWrapper.init(threeDeeDiv.current);
      isReady(true);
    }
  }, [threeDeeDiv]);

  return (
    <Content className={styles.contentContainer}>
      <div className={styles.threeDeeContainer}>
        <div className={styles.threeDeeView} ref={threeDeeDiv} />
        <div className={styles.backgroundContainer} />
        {ready ? <RootMeshContainer /> : null}
      </div>
    </Content>
  );
}
