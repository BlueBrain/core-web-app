import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { getSimulationCampaignExecutionAtom } from '@/state/explore-section/simulation-campaign';
import { useLoadableValue } from '@/hooks/hooks';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';

export default function SimulationCampaignStatus() {
  const resourceInfo = useResourceInfoFromPath();
  const execution = useLoadableValue(getSimulationCampaignExecutionAtom(resourceInfo));

  if (execution.state === 'loading') {
    return <Spin indicator={<LoadingOutlined />} />;
  }
  if (execution.state === 'hasData') {
    return <div>{execution?.data?.status}</div>;
  }
  return <div>-</div>;
}
