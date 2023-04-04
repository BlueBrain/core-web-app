import { useAtomValue } from 'jotai';
import { EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import BrainRegionVisualizationTrigger from '@/components/BrainRegionVisualizationTrigger';
import { meshDistributionsAtom } from '@/state/brain-regions';

export default function VisualizationTrigger({ colorCode, id }: { colorCode: string; id: string }) {
  const meshDistributions = useAtomValue(meshDistributionsAtom);

  if (meshDistributions === undefined) {
    return <LoadingOutlined style={{ fontSize: '16px' }} />;
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
    <button
      type="button"
      className="block border-none flex items-center justify-center w-[16px]"
      disabled
    >
      <EyeOutlined style={{ color: '#F5222D', fontSize: '16px' }} />
    </button>
  );
}
