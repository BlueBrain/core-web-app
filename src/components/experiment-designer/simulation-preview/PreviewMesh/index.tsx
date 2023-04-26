import { useEffect } from 'react';
import MeshGenerator from '@/components/MeshGenerator';
import PointCloudGenerator from '@/components/PointCloudGenerator';

import { useAtlasVisualizationManager } from '@/state/atlas';
import simPreviewThreeCtxWrapper from '@/components/experiment-designer/simulation-preview/SimulationPreview/SimPreviewThreeCtxWrapper';

export default function PreviewMesh() {
  const atlas = useAtlasVisualizationManager();
  // make should be visible meshes a union of both meshes and point clouds
  const shouldBeVisibleMeshes = atlas.visibleMeshes.map((mesh) => mesh.contentURL);
  const shouldBeVisiblePointClouds = atlas.visiblePointClouds.map((cloud) => cloud.regionID);
  const shouldBeVisible = shouldBeVisiblePointClouds.concat(shouldBeVisibleMeshes);
  const mc = simPreviewThreeCtxWrapper.getMeshCollection();
  const currentlyVisible = mc.getAllVisibleMeshes();

  currentlyVisible.forEach((meshID) => {
    const meshShouldBeVisible = shouldBeVisible.includes(meshID);
    if (!meshShouldBeVisible) {
      mc.hide(meshID);
    }
  });

  useEffect(() => {
    atlas.addVisibleObjects(
      {
        contentURL:
          'https://bbp.epfl.ch/nexus/v1/files/bbp/atlas/8652a1af-d8c6-432b-bda3-8f6b174c4095',
        color: '#00ff00',
        isLoading: false,
        hasError: false,
      },
      {
        regionID: '354',
        color: '#ffff00',
        isLoading: false,
        hasError: false,
      },
      {
        regionID: '519',
        color: '#0000ff',
        isLoading: false,
        hasError: false,
      }
    );
  }, [atlas]);

  return (
    <>
      <MeshGenerator threeContextWrapper={simPreviewThreeCtxWrapper} />
      <PointCloudGenerator
        circuitConfigPathOverride="/gpfs/bbp.cscs.ch/project/proj134/workflow-outputs/1ac4bcf3-cd0a-451c-aa4b-1a3a22914abc/microConnectomeConfig/distance__v0.3.3/circuit_config.json"
        threeContextWrapper={simPreviewThreeCtxWrapper}
      />
    </>
  );
}
