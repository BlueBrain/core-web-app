import MeshGenerator from '@/components/MeshGenerator';
import PointCloudGenerator from '@/components/PointCloudGenerator';
import threeCtxWrapper from '@/visual/ThreeCtxWrapper';
import { useAtlasVisualizationManager } from '@/state/atlas';

export default function PreviewMesh() {
  const atlas = useAtlasVisualizationManager();
  // make should be visible meshes a union of both meshes and point clouds
  const shouldBeVisibleMeshes = atlas.visibleMeshes.map((mesh) => mesh.contentURL);
  const shouldBeVisiblePointClouds = atlas.visiblePointClouds.map((cloud) => cloud.regionID);
  const shouldBeVisible = shouldBeVisiblePointClouds.concat(shouldBeVisibleMeshes);
  const mc = threeCtxWrapper.getMeshCollection();
  const currentlyVisible = mc.getAllVisibleMeshes();

  currentlyVisible.forEach((meshID) => {
    const meshShouldBeVisible = shouldBeVisible.includes(meshID);
    if (!meshShouldBeVisible) {
      mc.hide(meshID);
    }
  });

  return (
    <>
      <MeshGenerator />
      <PointCloudGenerator />
    </>
  );
}
