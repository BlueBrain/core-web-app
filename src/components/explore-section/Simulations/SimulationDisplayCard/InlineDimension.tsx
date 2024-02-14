import { Simulation } from '@/types/explore-section/es-simulation-campaign';

type InlineDimensionsProps = {
  value: number;
  status: Simulation['status'];
};

export default function InlineDimension({ value, status }: InlineDimensionsProps) {
  const renderBackgroundColor = () => {
    switch (status) {
      case 'Done':
        return 'bg-green-100';
      case 'Failed':
        return 'bg-red-100';
      case 'Running':
        return 'bg-sky-100';
      default:
        return 'bg-red-100';
    }
  };

  return (
    <div className="flex">
      <span className={`h-min w-min px-2 py-1 font-bold ${renderBackgroundColor()}`}>{value}</span>
    </div>
  );
}
