import { LoadingOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useAtlasVisualizationManager } from '@/state/atlas';
import BrainRegionMesh from '@/components/BrainRegionMesh';
import { ThreeCtxWrapper } from '@/visual/ThreeCtxWrapper';

interface MeshGeneratorProps {
  threeContextWrapper: ThreeCtxWrapper;
}

export default function MeshGenerator({ threeContextWrapper }: MeshGeneratorProps) {
  const atlas = useAtlasVisualizationManager();
  const shouldBeVisibleMeshes = atlas.visibleMeshes;
  const shouldBeVisiblePointClouds = atlas.visiblePointClouds;
  const allObjects = [...shouldBeVisibleMeshes, ...shouldBeVisiblePointClouds];
  const atLeastOneLoading = allObjects.some((obj) => obj.isLoading);

  useEffect(() => {
    // hack to make sure the canvas takes all
    window.dispatchEvent(new Event('resize'));
  }, [atLeastOneLoading]);

  return (
    <>
      {shouldBeVisibleMeshes.map((mesh) => (
        <BrainRegionMesh
          key={mesh.contentURL}
          id={mesh.contentURL}
          colorCode={mesh.color}
          threeContextWrapper={threeContextWrapper}
        />
      ))}
      {atLeastOneLoading ? (
        <div className="z-50 text-neutral-1 text-4xl absolute inset-1/2">
          <LoadingOutlined />
        </div>
      ) : null}
    </>
  );
}
