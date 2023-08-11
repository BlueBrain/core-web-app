import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { simulationCampaignStatusAtom } from '@/state/explore-section/simulation-campaign';

const statusLoadableAtom = loadable(simulationCampaignStatusAtom);

export default function SimulationCampaignStatus() {
  const status = useAtomValue(statusLoadableAtom);

  if (status.state === 'loading') {
    return <Spin indicator={<LoadingOutlined />} />;
  }
  if (status.state === 'hasData') {
    return <div>{status.data}</div>;
  }
  return <div>-</div>;
}
