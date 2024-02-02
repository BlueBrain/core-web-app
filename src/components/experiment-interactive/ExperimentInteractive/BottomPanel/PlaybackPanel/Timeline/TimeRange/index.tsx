import { useCurrentSimulationReport } from '@/components/experiment-interactive/ExperimentInteractive/hooks/current-report';

export default function TimeRange() {
  const report = useCurrentSimulationReport();
  if (!report) return null;

  return (
    <div className="flex w-full items-center justify-between text-white/70">
      <div className="text-left">{report.start} ms</div>
      <div className="text-right">{report.end} ms</div>
    </div>
  );
}
