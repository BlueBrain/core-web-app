import { InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useMemo } from 'react';
import CenteredMessage from '@/components/CenteredMessage';
import { Simulation } from '@/types/explore-section/resources';
import AnalysisReportImage from '@/components/explore-section/Simulations/SimulationDisplayCard/AnalysisReportImage';
import {
  getAnalysisReportsArgs,
  getAnalysisReportsFamily,
} from '@/state/explore-section/simulation-campaign';
import { useEnsuredPath, useUnwrappedValue } from '@/hooks/hooks';

type SimulationDisplayCardProps = {
  name?: string;
  simulation: Simulation;
  customReportIds?: string[];
};

export default function SimulationDisplayCard({
  name,
  simulation,
  customReportIds,
}: SimulationDisplayCardProps) {
  const path = useEnsuredPath();

  if (Boolean(name) === Boolean(customReportIds))
    throw new Error('Provide only one of name and customReportIds');

  const analysisReports = useUnwrappedValue(
    getAnalysisReportsFamily(path)(...getAnalysisReportsArgs(simulation.id, name, customReportIds))
  );

  const report = useMemo(() => {
    if (!analysisReports) return;
    if (name) {
      if (analysisReports.length > 1) throw new Error('Error, data fetching error'); // If name was specified there should be at most one fetched report
      return analysisReports[0];
    }
    return analysisReports.find((r) => r.simulation === simulation.id);
  }, [analysisReports, name, simulation.id]);

  if (!analysisReports) return <Spin indicator={<LoadingOutlined />} />;

  return report?.blob ? (
    <AnalysisReportImage
      title={simulation.title}
      id={simulation.id}
      project={simulation.project}
      blob={report.blob}
      createdAt={report.createdAt}
      createdBy={report.createdBy}
    />
  ) : (
    <CenteredMessage
      message="There is no report for this simulation"
      icon={<InfoCircleOutlined className="text-5xl" />}
    />
  );
}
