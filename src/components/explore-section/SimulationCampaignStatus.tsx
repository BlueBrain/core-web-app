import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import { simulationCampaignStatusAtom } from '@/state/explore-section/simulation-campaign';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';

export default function SimulationCampaignStatus() {
  const resourceInfo = useResourceInfoFromPath();

  const status = useAtomValue(
    useMemo(() => loadable(simulationCampaignStatusAtom(resourceInfo)), [resourceInfo])
  );

  if (status.state === 'loading') {
    return <Spin indicator={<LoadingOutlined />} />;
  }
  if (status.state === 'hasData') {
    return <div>{status.data}</div>;
  }
  return <div>-</div>;
}
