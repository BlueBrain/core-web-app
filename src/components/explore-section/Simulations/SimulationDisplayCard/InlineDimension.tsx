import { SimulationStatus } from '@/types/explore-section';

type InlineDimensionsProps = {
  value: number;
  status: SimulationStatus;
};

export default function InlineDimension({ value, status }: InlineDimensionsProps) {
  const renderBackgroundColor = () => {
    switch (status) {
      case 'done':
        return 'bg-green-100';
      case 'failed':
        return 'bg-red-100';
      case 'cancelled':
        return 'bg-neutral-1';
      default:
        return 'bg-sky-100';
    }
  };

  return (
    <div className="flex">
      <span className={`h-min w-min px-2 py-1 font-bold ${renderBackgroundColor()}`}>{value}</span>
    </div>
  );
}
