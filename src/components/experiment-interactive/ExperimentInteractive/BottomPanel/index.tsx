import BottomLegendPanel from './BottomLegendPanel';
import PlaybackPanel from './PlaybackPanel';
import GenerateMoviePanel from './GenerateMoviePanel';
import { SimulationReport } from '@/services/brayns/simulations/resource-manager/backend-service';

export interface BottomPanelProps {
  report: SimulationReport;
}

export default function BottomPanel({ report }: BottomPanelProps) {
  return (
    <div className="w-full flex flex-col divide-y relative">
      <div className="w-full flex flex-col divide-y divide-white/20">
        <div className="relative">
          <PlaybackPanel report={report} />
        </div>

        <div className="relative">
          <div className="flex w-full flex-row gap-10 items-center p-3">
            <BottomLegendPanel />
            <GenerateMoviePanel />
          </div>
        </div>
      </div>
    </div>
  );
}
