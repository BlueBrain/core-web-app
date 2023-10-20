import { InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useMemo } from 'react';
import CenteredMessage from '@/components/CenteredMessage';
import SimulationCard from '@/components/explore-section/Simulations/SimulationDisplayCard/SimulationCard';
import { Simulation } from '@/types/explore-section/resources';
import AnalysisReportImage from '@/components/explore-section/Simulations/SimulationDisplayCard/AnalysisReportImage';
import { analysisReportsAtom } from '@/state/explore-section/simulation-campaign';
import { useLoadableValue } from '@/hooks/hooks';

type SimulationDisplayCardProps = {
  display: string;
  simulation: Simulation;
  xDimension: string;
  yDimension: string;
};

export default function SimulationDisplayCard({
  display,
  simulation,
  xDimension,
  yDimension,
}: SimulationDisplayCardProps) {
  const analysisReports = useLoadableValue(analysisReportsAtom);

  const blobData = useMemo(() => {
    if (analysisReports.state !== 'hasData') return;

    return analysisReports.data?.find(
      ({ simulation: id, name: type }) => id === simulation.id && type === display
    );
  }, [analysisReports, display, simulation.id]);

  if (display === 'status') {
    return (
      <SimulationCard simulation={simulation} xDimension={xDimension} yDimension={yDimension} />
    );
  }
  if (analysisReports.state === 'loading') {
    return <Spin indicator={<LoadingOutlined />} />;
  }

  return blobData ? (
    <AnalysisReportImage
      title={simulation.title}
      id={simulation.id}
      project={simulation.project}
      blob={blobData.blob}
      createdAt={blobData.createdAt}
      createdBy={blobData.createdBy}
    />
  ) : (
    <CenteredMessage
      message="There is no report for this simulation"
      icon={<InfoCircleOutlined className="text-5xl" />}
    />
  );
}
