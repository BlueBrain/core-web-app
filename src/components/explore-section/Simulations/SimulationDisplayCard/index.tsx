import { useAtomValue } from 'jotai';
import { InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { loadable } from 'jotai/utils';
import { Spin } from 'antd';
import { useMemo } from 'react';
import CenteredMessage from '@/components/CenteredMessage';
import SimulationCard from '@/components/explore-section/Simulations/SimulationDisplayCard/SimulationCard';
import { Simulation } from '@/types/explore-section/resources';
import AnalysisReportImage from '@/components/explore-section/Simulations/SimulationDisplayCard/AnalysisReportImage';
import { analysisReportsAtom } from '@/state/explore-section/simulation-campaign';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';

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
  const resourceInfo = useResourceInfoFromPath();

  const analysisReports = useAtomValue(
    useMemo(() => loadable(analysisReportsAtom(resourceInfo)), [resourceInfo])
  );
  if (display === 'status') {
    return (
      <SimulationCard simulation={simulation} xDimension={xDimension} yDimension={yDimension} />
    );
  }
  if (analysisReports.state === 'loading') {
    return <Spin indicator={<LoadingOutlined />} />;
  }
  if (analysisReports.state === 'hasData') {
    const { blob, createdAt, createdBy } = analysisReports.data?.find(
      ({ simulation: id, name: type }) => id === simulation.id && type === display
    ) ?? {
      blob: undefined,
      name: undefined,
    };

    return blob ? (
      <AnalysisReportImage
        title={simulation.title}
        id={simulation.id}
        project={simulation.project}
        blob={blob}
        createdAt={createdAt}
        createdBy={createdBy}
      />
    ) : (
      <CenteredMessage
        message="There is no report for this simulation"
        icon={<InfoCircleOutlined className="text-5xl" />}
      />
    );
  }
}
