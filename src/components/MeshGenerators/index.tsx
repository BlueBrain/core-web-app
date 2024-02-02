import { useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import PointCloudGenerator from '@/components/MeshGenerators/PointCloudGenerator';
import BrainRegionMeshGenerator from '@/components/MeshGenerators/BrainRegionMeshGenerator';
import { ThreeCtxWrapper } from '@/visual/ThreeCtxWrapper';
import NodeSetMeshGenerator from '@/components/MeshGenerators/NodeSetMeshGenerator';
import { atlasVisualizationAtom } from '@/state/atlas/atlas';
import { CameraType } from '@/types/experiment-designer-visualization';

interface MeshGeneratorsProps {
  threeContextWrapper: ThreeCtxWrapper;
  circuitConfigPathOverride?: string;
  cameraType?: CameraType;
}

export default function MeshGenerators({
  threeContextWrapper,
  circuitConfigPathOverride,
  cameraType,
}: MeshGeneratorsProps) {
  const [atlasVisualization] = useAtom(atlasVisualizationAtom);

  const atLeastOneLoading = useMemo(() => {
    const allObjects = [
      ...atlasVisualization.visibleMeshes,
      ...atlasVisualization.visiblePointClouds,
      ...atlasVisualization.visibleNodeSets,
    ];
    return allObjects.some((obj) => obj.isLoading);
  }, [
    atlasVisualization.visibleMeshes,
    atlasVisualization.visibleNodeSets,
    atlasVisualization.visiblePointClouds,
  ]);

  useEffect(() => {
    // hack to make sure the canvas takes all
    window.dispatchEvent(new Event('resize'));
  }, [atLeastOneLoading]);

  return (
    <>
      <BrainRegionMeshGenerator threeContextWrapper={threeContextWrapper} />
      <PointCloudGenerator
        threeContextWrapper={threeContextWrapper}
        circuitConfigPathOverride={circuitConfigPathOverride}
      />
      <NodeSetMeshGenerator
        threeContextWrapper={threeContextWrapper}
        circuitConfigPathOverride={circuitConfigPathOverride}
        cameraType={cameraType}
      />
      {atLeastOneLoading && (
        <div className="absolute inset-1/2 z-50 text-4xl text-neutral-1">
          <LoadingOutlined />
        </div>
      )}
    </>
  );
}
