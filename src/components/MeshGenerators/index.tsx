import { useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import PointCloudGenerator from '@/components/MeshGenerators/PointCloudGenerator';
import BrainRegionMeshGenerator from '@/components/MeshGenerators/BrainRegionMeshGenerator';
import { ThreeCtxWrapper } from '@/visual/ThreeCtxWrapper';
import NodeSetMeshGenerator from '@/components/MeshGenerators/NodeSetMeshGenerator';
import { atlasVisualizationAtom } from '@/state/atlas/atlas';

interface MeshGeneratorsProps {
  threeContextWrapper: ThreeCtxWrapper;
  circuitConfigPathOverride?: string;
}

export default function MeshGenerators({
  threeContextWrapper,
  circuitConfigPathOverride,
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
      />
      {atLeastOneLoading && (
        <div className="z-50 text-neutral-1 text-4xl absolute inset-1/2">
          <LoadingOutlined />
        </div>
      )}
    </>
  );
}
