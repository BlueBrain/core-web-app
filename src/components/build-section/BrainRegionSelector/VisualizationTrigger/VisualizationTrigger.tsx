import { useAtomValue } from 'jotai';
import { EyeOutlined, LoadingOutlined } from '@ant-design/icons';

import CellButton from './CellButton';
import MeshButton from './MeshButton';
import { meshDistributionsAtom } from '@/state/brain-regions';

export default function VisualizationTrigger({ colorCode, id }: { colorCode: string; id: string }) {
  const meshDistributions = useAtomValue(meshDistributionsAtom);

  if (meshDistributions === undefined) {
    return <LoadingOutlined style={{ fontSize: '16px' }} />;
  }

  const meshDistribution = meshDistributions && meshDistributions[id];

  if (meshDistribution && colorCode) {
    return (
      <>
        <CellButton regionID={id} colorCode={colorCode} />
        <MeshButton contentURL={meshDistribution.contentUrl} regionID={id} colorCode={colorCode} />
      </>
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
