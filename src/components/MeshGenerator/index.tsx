import { useAtomValue } from 'jotai/react';
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import AtlasVisualizationAtom from '@/state/atlas';
import BrainRegionMesh from '@/components/BrainRegionMesh';

export default function MeshGenerator() {
  const shouldBeVisibleMeshes = useAtomValue(AtlasVisualizationAtom).visibleMeshes;
  const shouldBeVisiblePointClouds = useAtomValue(AtlasVisualizationAtom).visiblePointClouds;
  const allMeshes = [...shouldBeVisibleMeshes, ...shouldBeVisiblePointClouds];
  const atLeastOneLoading = allMeshes.some((meshToFind) => meshToFind.isLoading);

  useEffect(() => {
    // hack to make sure the canvas takes all
    window.dispatchEvent(new Event('resize'));
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
