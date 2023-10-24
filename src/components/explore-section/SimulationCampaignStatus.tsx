import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { getSimCapaignExecutionAtom } from '@/state/explore-section/simulation-campaign';
import { useEnsuredPath, useLoadableValue } from '@/hooks/hooks';

export default function SimulationCampaignStatus() {
  const path = useEnsuredPath();
  const execution = useLoadableValue(getSimCapaignExecutionAtom(path));

  if (execution.state === 'loading') {
    return <Spin indicator={<LoadingOutlined />} />;
  }
  if (execution.state === 'hasData') {
    return <div>{execution?.data?.status}</div>;
  }
  return <div>-</div>;
}
