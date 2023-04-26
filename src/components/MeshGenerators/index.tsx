import PointCloudGenerator from '@/components/MeshGenerators/PointCloudGenerator';
import BrainRegionMeshGenerator from '@/components/MeshGenerators/BrainRegionMeshGenerator';
import { ThreeCtxWrapper } from '@/visual/ThreeCtxWrapper';

interface MeshGeneratorsProps {
  threeContextWrapper: ThreeCtxWrapper;
  circuitConfigPathOverride?: string;
}

export default function MeshGenerators({
  threeContextWrapper,
  circuitConfigPathOverride,
}: MeshGeneratorsProps) {
  return (
    <>
      <BrainRegionMeshGenerator threeContextWrapper={threeContextWrapper} />
      <PointCloudGenerator
        threeContextWrapper={threeContextWrapper}
        circuitConfigPathOverride={circuitConfigPathOverride}
      />
    </>
  );
}
