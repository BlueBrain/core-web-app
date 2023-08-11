import { useAtomValue } from 'jotai';
import { InfoCircleOutlined } from '@ant-design/icons';
import CenteredMessage from '@/components/CenteredMessage';
import SimulationCard from '@/components/explore-section/Simulations/SimulationDisplayCard/SimulationCard';
import { Simulation } from '@/types/explore-section/resources';
import AnalysisReportImage from '@/components/explore-section/Simulations/SimulationDisplayCard/AnalysisReportImage';
import { analysisReportsAtom } from '@/state/explore-section/simulation-campaign';

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
  const analysisReports = useAtomValue(analysisReportsAtom);
  const { blob, name } = analysisReports.find(({ simulation: id }) => id === simulation.id) ?? {
    blob: undefined,
    name: undefined,
  };

  if (display === 'status') {
    return (
      <SimulationCard simulation={simulation} xDimension={xDimension} yDimension={yDimension} />
    );
  }

  return display === name ? (
    <AnalysisReportImage id={simulation.id} project={simulation.project} blob={blob} />
  ) : (
    <CenteredMessage
      message="This display is not implemented yet"
      icon={<InfoCircleOutlined className="text-5xl" />}
    />
  );
}
