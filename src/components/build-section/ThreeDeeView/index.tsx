'use client';

import { useEffect, useRef, useState } from 'react';
import { Layout } from 'antd';
import threeCtxWrapper from '@/visual/ThreeCtxWrapper';
import { useAtlasVisualizationManager } from '@/state/atlas';
import MeshGenerators from '@/components/MeshGenerators';
import styles from './styles.module.css';

const { Content } = Layout;

function RootMesh() {
  const atlas = useAtlasVisualizationManager();
  // make should be visible meshes a union of both meshes and point clouds
  const shouldBeVisibleMeshes = atlas.visibleMeshes.map((mesh) => mesh.contentURL);
  const shouldBeVisiblePointClouds = atlas.visiblePointClouds.map((cloud) => cloud.regionID);
  const shouldBeVisible = shouldBeVisiblePointClouds.concat(shouldBeVisibleMeshes);
  const meshCollection = threeCtxWrapper.getMeshCollection();
  const currentlyVisible = meshCollection.getAllVisibleMeshes();

  currentlyVisible.forEach((meshID) => {
    const meshShouldBeVisible = shouldBeVisible.includes(meshID);
    if (!meshShouldBeVisible) {
      meshCollection.hide(meshID);
    }
  });

  return <MeshGenerators threeContextWrapper={threeCtxWrapper} />;
}

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
