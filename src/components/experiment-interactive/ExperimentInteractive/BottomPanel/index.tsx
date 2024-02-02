import BottomLegendPanel from './BottomLegendPanel';
import PlaybackPanel from './PlaybackPanel';
import GenerateMoviePanel from './GenerateMoviePanel';

export default function BottomPanel() {
  return (
    <div className="relative flex w-full flex-col divide-y">
      <div className="flex w-full flex-col divide-y divide-white/20">
        <div className="relative">
          <PlaybackPanel />
        </div>

        <div className="relative">
          <div className="flex w-full flex-row items-center gap-10 p-3">
            <BottomLegendPanel />
            <GenerateMoviePanel />
          </div>
        </div>
      </div>
    </div>
  );
}
