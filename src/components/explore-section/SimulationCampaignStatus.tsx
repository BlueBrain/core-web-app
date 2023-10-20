import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { simulationCampaignExecutionAtom } from '@/state/explore-section/simulation-campaign';
import { useLoadableValue } from '@/hooks/hooks';

export default function SimulationCampaignStatus() {
  const execution = useLoadableValue(simulationCampaignExecutionAtom);

  if (execution.state === 'loading') {
    return <Spin indicator={<LoadingOutlined />} />;
  }
  if (execution.state === 'hasData') {
    return <div>{execution?.data?.status}</div>;
  }
  return <div>-</div>;
}
