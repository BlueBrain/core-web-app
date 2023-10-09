'use client';

import { Timeline } from './Timeline';
import StepNavigator from './StepNavigator';
import StepSize from './StepSize';
import { SimulationReport } from '@/services/brayns/simulations/resource-manager/backend-service';

export interface PlaybackPanelProps {
  report: SimulationReport;
}

export default function PlaybackPanel({ report }: PlaybackPanelProps) {
  return (
    <div className="w-full p-5 flex flex-row gap-10">
      <Timeline report={report} />

      <div className="w-4/12 h-full flex flex-row items-center h-5 gap-10">
        <StepNavigator />
        <StepSize />
      </div>
    </div>
  );
}
