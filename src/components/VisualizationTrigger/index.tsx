import { useAtomValue } from 'jotai/react';
import { Button } from 'antd';
import { EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import BrainRegionVisualizationTrigger from '@/components/BrainRegionVisualizationTrigger';
import { meshDistributionsAtom } from '@/state/brain-regions';

export default function VisualizationTrigger({ colorCode, id }: { colorCode: string; id: string }) {
  const meshDistributions = useAtomValue(meshDistributionsAtom);

  if (meshDistributions === undefined) {
    return <LoadingOutlined />;
  }

  const meshDistribution = meshDistributions && meshDistributions[id];

  if (meshDistribution && colorCode) {
    return (
      <BrainRegionVisualizationTrigger
        regionID={id}
        distribution={meshDistribution}
        colorCode={colorCode}
      />
    );
  }

  return (
    <Button
      className="border-none items-center justify-center flex"
      type="text"
      disabled
      icon={<EyeOutlined style={{ color: '#F5222D' }} />}
    />
  );
}
