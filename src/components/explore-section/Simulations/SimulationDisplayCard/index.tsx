import { InfoCircleOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import CenteredMessage from '@/components/CenteredMessage';
import SimulationCard from '@/components/explore-section/Simulations/SimulationDisplayCard/SimulationCard';
import { Simulation } from '@/types/explore-section/resources';
import AnalysisReportImage from '@/components/explore-section/Simulations/SimulationDisplayCard/AnalysisReportImage';
import { AnalysisReportWithImage } from '@/types/explore-section/es-analysis-report';

type SimulationDisplayCardProps = {
  display?: string;
  simulation: Simulation;
  xDimension: string;
  yDimension: string;
  analysisReports?: AnalysisReportWithImage[];
};

export default function SimulationDisplayCard({
  display,
  simulation,
  xDimension,
  yDimension,
  analysisReports,
}: SimulationDisplayCardProps) {
  const matchingReport = useMemo(() => {
    if (display)
      return analysisReports?.find(
        (r) => r.simulation === simulation.id && r.name === display // Reports from Sim Campaign
      );
    return analysisReports?.find((report) => report.simulation === simulation.id); // Reports from Custom Analysis
  }, [display, simulation.id, analysisReports]);

  if (display === 'status') {
    return (
      <SimulationCard simulation={simulation} xDimension={xDimension} yDimension={yDimension} />
    );
  }

  console.log(matchingReport);

  return matchingReport ? (
    <AnalysisReportImage
      title={simulation.title}
      id={simulation.id}
      project={simulation.project}
      blob={matchingReport.blob}
      createdAt={matchingReport.createdAt || matchingReport._createdAt}
      createdBy={matchingReport.createdBy || matchingReport._createdBy}
    />
  ) : (
    <CenteredMessage
      message="There is no report for this simulation"
      icon={<InfoCircleOutlined className="text-5xl" />}
    />
  );
}
