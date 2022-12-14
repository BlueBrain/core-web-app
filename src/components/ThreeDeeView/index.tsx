'use client';

import { useEffect, useRef, useState } from 'react';
import { Layout } from 'antd';
import threeCtxWrapper from '@/visual/ThreeCtxWrapper';
import MeshGenerator from '@/components/MeshGenerator';
import styles from './styles.module.css';

const { Content } = Layout;

export default function ThreeDeeView() {
  const [ready, isReady] = useState(false);
  const threeDeeDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    threeCtxWrapper.init(threeDeeDiv.current);
    isReady(true);
  }, [threeDeeDiv]);

  return (
    <Content className={styles.contentContainer}>
      <div className={styles.threeDeeContainer}>
        <div className={styles.threeDeeView} ref={threeDeeDiv} />
        <div className={styles.backgroundContainer} />
        {ready ? <MeshGenerator /> : null}
      </div>
    </Content>
  );
}
