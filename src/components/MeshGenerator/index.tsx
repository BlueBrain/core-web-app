import { useAtomValue } from 'jotai';
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import threeCtxWrapper from '@/visual/ThreeCtxWrapper';
import AtlasVisualizationAtom from '@/state/atlas';
import BrainRegionMesh from '@/components/BrainRegionMesh';

export default function MeshGenerator() {
  const shouldBeVisibleMeshes = useAtomValue(AtlasVisualizationAtom).visibleMeshes;
  const mc = threeCtxWrapper.getMeshCollection();
  const currentlyVisible = mc.getAllVisibleMeshes(
    shouldBeVisibleMeshes.map((mesh) => mesh.contentURL)
  );

  currentlyVisible.forEach((meshID) => {
    const isVisible = shouldBeVisibleMeshes.filter((mesh) => mesh.contentURL === meshID).length > 0;
    if (!isVisible && currentlyVisible.includes(meshID)) {
      mc.hide(meshID);
    }
  });

  const atLeastOneLoading = shouldBeVisibleMeshes.find((meshToFind) => meshToFind.isLoading);

  useEffect(() => {
    if (!atLeastOneLoading) {
      // hack to make sure the canvas takes all
      window.dispatchEvent(new Event('resize'));
    }
  }, [atLeastOneLoading]);

  return (
    <>
      {shouldBeVisibleMeshes.map((mesh) => (
        <BrainRegionMesh key={mesh.contentURL} id={mesh.contentURL} colorCode={mesh.color} />
      ))}
      {atLeastOneLoading ? (
        <div className="z-50 text-neutral-1 text-4xl absolute inset-1/2">
          <LoadingOutlined />
        </div>
      ) : null}
    </>
  );
}
