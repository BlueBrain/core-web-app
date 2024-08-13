import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { simCampaignExecutionFamily } from '@/state/explore-section/simulation-campaign';
import { useEnsuredPath, useLoadableValue } from '@/hooks/hooks';
import { DisplayMessages } from '@/constants/display-messages';

export default function SimulationCampaignStatus() {
  const path = useEnsuredPath();
  const execution = useLoadableValue(simCampaignExecutionFamily(path));

  if (execution.state === 'loading') {
    return <Spin indicator={<LoadingOutlined />} />;
  }
  if (execution.state === 'hasData') {
    return <div>{execution?.data?.status}</div>;
  }
  return DisplayMessages.NO_DATA_STRING;
}
