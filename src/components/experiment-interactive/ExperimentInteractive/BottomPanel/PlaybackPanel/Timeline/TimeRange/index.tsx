export interface TimeRangeProps {
  simulationDuration: number;
}

export default function TimeRange({ simulationDuration }: TimeRangeProps) {
  return (
    <div className="flex justify-between w-full items-center text-white/70">
      <div className="text-left">0 ms</div>
      <div className="text-right">{simulationDuration} ms</div>
    </div>
  );
}
