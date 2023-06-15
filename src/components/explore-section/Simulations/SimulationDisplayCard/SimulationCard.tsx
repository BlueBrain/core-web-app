import { EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import { SimulationResource } from '@/types/explore-section/resources';
import InlineDimension from '@/components/explore-section/Simulations/SimulationDisplayCard/InlineDimension';
import timeElapsedFromToday from '@/util/date';

type SimulationCardProps = {
  simulation: SimulationResource;
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
      <div className="text-neutral-4 font-light text-xs">{title}</div>
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
      case 'running':
        return 'text-primary-7';
      case 'done':
        return 'text-secondary-3';
      case 'failed':
        return 'text-error';
      case 'cancelled':
        return 'text-neutral-4';
      default:
        return '';
    }
  };

  const renderStatus = () => {
    switch (simulation.status) {
      case 'running':
        return 'Running';
      case 'done':
        return 'Done';
      case 'failed':
        return 'Failed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return '';
    }
  };

  const renderOtherDimensions = () =>
    Object.entries(simulation.coords).map(([key, value]) => {
      if (key !== xDimension && key !== yDimension) {
        return (
          <div key={key} className="mr-4 flex-2">
            <div>{key}</div>
            <InlineDimension value={value} status={simulation.status} />
          </div>
        );
      }
      return null;
    });

  const renderStrapStyles = () => {
    switch (simulation.status) {
      case 'running':
        return 'linear-gradient(90deg, rgb(65, 121, 201) 0%, rgb(0, 58, 140) 50%)';
      case 'done':
        return 'linear-gradient(90deg, rgba(12,135,39,1) 0%, rgba(5,193,46,1) 50%)';
      case 'failed':
        return 'linear-gradient(90deg, rgba(249,145,145,1) 0%, rgba(229,41,41,1) 50%)';
      case 'cancelled':
        return 'linear-gradient(90deg, rgba(211,211,211,1) 0%, rgba(90,90,90,1) 50%)';
      default:
        return '';
    }
  };

  return (
    <div
      className={`simulation-card w-[405px] border rounded rounded-b-none border-neutral-2 border-b-none ${backgroundColor()}`}
    >
      <div className="p-4">
        <div className="flex mb-3">{renderOtherDimensions()}</div>
        <div className="flex my-2 my-3">
          <CardField title="STATUS" value={renderStatus()} />
          <CardField title="STARTED" value={timeElapsedFromToday(simulation.startedAt)} />
          <CardField title="COMPLETED" value={timeElapsedFromToday(simulation.completedAt)} />
        </div>
        <hr />
        <div className="mt-2 w-full flex">
          <div className="text-neutral-4 flex-auto w-64 font-light text-xs">ACTIONS</div>
          <div className="flex-auto w-16">
            Log <FileTextOutlined />
          </div>
          <div className="flex-auto w-16">
            View <EyeOutlined />
          </div>
        </div>
      </div>
      <div className="h-3 bg-primary-5 bottom-border" style={{ background: renderStrapStyles() }} />
    </div>
  );
}
