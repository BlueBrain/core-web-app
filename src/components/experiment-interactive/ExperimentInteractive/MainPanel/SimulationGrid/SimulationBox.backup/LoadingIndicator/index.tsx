import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useSimulationPreview } from '@/components/experiment-interactive/ExperimentInteractive/MainPanel/SimulationGrid/SimulationBox.backup/hooks';

const antIcon = <LoadingOutlined style={{ float: 'left', fontSize: 24 }} spin />;

export default function LoadingIndicator() {
  const { isLoading } = useSimulationPreview();

  return isLoading ? (
    <div className="absolute w-full h-full flex flex-row items-center justify-center">
      <Spin indicator={antIcon} />
    </div>
  ) : null;
}
