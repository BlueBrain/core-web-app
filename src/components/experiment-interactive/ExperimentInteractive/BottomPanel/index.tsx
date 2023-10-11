import BottomLegendPanel from './BottomLegendPanel';
import PlaybackPanel from './PlaybackPanel';
import GenerateMoviePanel from './GenerateMoviePanel';

export default function BottomPanel() {
  return (
    <div className="w-full flex flex-col divide-y relative">
      <div className="w-full flex flex-col divide-y divide-white/20">
        <div className="relative">
          <PlaybackPanel />
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
