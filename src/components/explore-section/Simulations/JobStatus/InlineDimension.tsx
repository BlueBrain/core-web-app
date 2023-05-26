import { Dimension, SimulationStatus } from '@/types/explore-section';

type InlineDimensionsProps = {
  dimension: Dimension;
  status: SimulationStatus;
};

export default function InlineDimension({ dimension, status }: InlineDimensionsProps) {
  const renderBackgroundColor = () => {
    switch (status) {
      case 'successful':
        return 'bg-green-100';
      case 'failed':
        return 'bg-red-100';
      default:
        return 'bg-sky-100';
    }
  };

  return (
    <div className="flex">
      <span className="truncate flex-1">{dimension.label}</span>
      <span className={`ml-2 h-min w-min px-2 py-1 font-bold ${renderBackgroundColor()}`}>
        {dimension.value.join(',')}
      </span>
    </div>
  );
}
