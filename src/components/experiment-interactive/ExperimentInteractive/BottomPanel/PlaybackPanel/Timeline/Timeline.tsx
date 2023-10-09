import TimeRange from './TimeRange';
import TimeMarkers from './TimeMarkers';
import TimeSlider from './TimeSlider';
import { SimulationReport } from '@/services/brayns/simulations/resource-manager/backend-service';

export interface TimelineProps {
  report: SimulationReport;
}

export default function Timeline({ report }: TimelineProps) {
  return (
    <div className="w-8/12">
      <div className="w-full overflow-hidden">
        <div className="flex flex-col pt-1 px-3">
          <TimeMarkers />
          <TimeSlider />
          <TimeRange simulationDuration={report.end - report.start} />
        </div>
      </div>
    </div>
  );
}
