import { EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import { FormattedSimulation } from '@/types/explore-section/es-simulation-campaign';
import InlineDimension from '@/components/explore-section/Simulations/SimulationDisplayCard/InlineDimension';
import timeElapsedFromToday from '@/util/date';
import Link from '@/components/Link';
import usePathname from '@/hooks/pathname';
import { buildSimulationDetailURL } from '@/components/explore-section/Simulations/utils';

type SimulationCardProps = {
  simulation: FormattedSimulation;
  xDimension: string;
  yDimension: string;
};

type CardFieldProps = {
  title: string;
  value: string;
};

function CardField({ title, value }: CardFieldProps) {
  return (
    <div className="flex-1">
      <div className="text-xs font-light text-neutral-4">{title}</div>
      <div>{value}</div>
    </div>
  );
}

export default function SimulationCard({
  simulation,
  xDimension,
  yDimension,
}: SimulationCardProps) {
  const backgroundColor = () => {
    switch (simulation.status) {
      case 'Running':
        return 'text-primary-7';
      case 'Done':
        return 'text-secondary-3';
      case 'Failed':
        return 'text-error';
      default:
        return '';
    }
  };

  const renderStatus = () => {
    switch (simulation.status) {
      case 'Running':
        return 'Running';
      case 'Done':
        return 'Done';
      case 'Failed':
        return 'Failed';
      default:
        return '';
    }
  };

  const renderOtherDimensions = () =>
    Object.entries(simulation.dimensions).map(([key, value]) => {
      if (key !== xDimension && key !== yDimension) {
        return (
          <div key={key} className="flex-2 mr-4">
            <div>{key}</div>
            <InlineDimension
              value={value as number} // TODO: Confirm that FormattedSimulation["dimensions"]["coords"] can also be just a number
              status={simulation.status}
            />
          </div>
        );
      }
      return null;
    });

  const renderStrapStyles = () => {
    switch (simulation.status) {
      case 'Running':
        return 'linear-gradient(90deg, rgb(65, 121, 201) 0%, rgb(0, 58, 140) 50%)';
      case 'Done':
        return 'linear-gradient(90deg, rgba(12,135,39,1) 0%, rgba(5,193,46,1) 50%)';
      case 'Failed':
        return 'linear-gradient(90deg, rgba(249,145,145,1) 0%, rgba(229,41,41,1) 50%)';
      default:
        return '';
    }
  };

  const [proj, org] = simulation.project.split('/').reverse();
  const pathName = usePathname();
  return (
    <div
      className={`simulation-card border-b-none w-[405px] rounded rounded-b-none border border-neutral-2 ${backgroundColor()}`}
    >
      <div className="p-4">
        <div className="mb-3 flex">{renderOtherDimensions()}</div>
        <div className="my-2 my-3 flex">
          <CardField title="STATUS" value={renderStatus()} />
          <CardField title="STARTED" value={timeElapsedFromToday(simulation.startedAt)} />
          <CardField title="COMPLETED" value={timeElapsedFromToday(simulation.completedAt)} />
        </div>
        <hr />
        <div className="mt-2 flex w-full">
          <div className="w-64 flex-auto text-xs font-light text-neutral-4">ACTIONS</div>
          <div className="w-16 flex-auto">
            Log <FileTextOutlined />
          </div>
          <Link
            href={buildSimulationDetailURL(org, proj, simulation.id, pathName)}
            className="w-16 flex-auto"
          >
            View <EyeOutlined />
          </Link>
        </div>
      </div>
      <div className="bottom-border h-3 bg-primary-5" style={{ background: renderStrapStyles() }} />
    </div>
  );
}
