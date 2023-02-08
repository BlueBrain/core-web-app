import { useAtomValue } from 'jotai/react';
import MeshGenerator from '@/components/MeshGenerator';
import PointCloudGenerator from '@/components/PointCloudGenerator';
import threeCtxWrapper from '@/visual/ThreeCtxWrapper';
import AtlasVisualizationAtom from '@/state/brain-factory/atlas';

export default function RootMesh() {
  // make should be visible meshes a union of both meshes and point clouds
  const shouldBeVisibleMeshes = useAtomValue(AtlasVisualizationAtom).visibleMeshes.map(
    (mesh) => mesh.contentURL
  );
  const shouldBeVisiblePointClouds = useAtomValue(AtlasVisualizationAtom).visiblePointClouds.map(
    (pc) => pc.regionID
  );
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
