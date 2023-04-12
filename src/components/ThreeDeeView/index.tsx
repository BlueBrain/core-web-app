'use client';

import { useEffect, useRef, useState } from 'react';
import { Layout } from 'antd';
import threeCtxWrapper from '@/visual/ThreeCtxWrapper';
import RootMesh from '@/components/RootMesh';
import styles from './styles.module.css';

const { Content } = Layout;

export default function ThreeDeeView() {
  const [ready, isReady] = useState(false);
  const threeDeeDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (threeDeeDiv.current) {
      threeCtxWrapper.init({ targetDiv: threeDeeDiv.current });
      isReady(true);
    }
  }, [threeDeeDiv]);

  return (
    <Content className={styles.contentContainer}>
      <div className={styles.threeDeeContainer}>
        <div className={styles.threeDeeView} ref={threeDeeDiv} />
        <div className={styles.backgroundContainer} />
        {ready ? <RootMesh /> : null}
      </div>
    </Content>
  );
}
