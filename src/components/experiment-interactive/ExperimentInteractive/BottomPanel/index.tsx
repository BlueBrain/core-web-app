import BottomLegendPanel from './BottomLegendPanel';
import PlaybackPanel from './PlaybackPanel';
import GenerateMoviePanel from './GenerateMoviePanel';
import { useExperimentInteractive } from '@/components/experiment-interactive/ExperimentInteractive/hooks';

export default function BottomPanel() {
  const { isBulkEditingMode, cancelBulkEditing, applyBulkEditing } = useExperimentInteractive();

  return (
    <div className="w-full flex flex-col divide-y relative">
      <div
        className={`w-full flex flex-col divide-y ${
          isBulkEditingMode ? `divide-white/0` : `divide-white/20`
        }`}
      >
        <div className="relative">
          <PlaybackPanel />
          {isBulkEditingMode ? (
            <div className="bg-black/90 w-full h-full absolute left-0 top-0 flex flex-row items-center justify-end px-3">
              <div className="w-full flex flex-row gap-5 justify-end items-center">
                <button type="button" className="inline-flex p-3" onClick={cancelBulkEditing}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex p-3 px-5 bg-accent-dark text-white font-semibold text-sm"
                  onClick={applyBulkEditing}
                >
                  Confirm changes
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="relative">
          <div className="flex w-full flex-row gap-10 items-center p-3">
            <BottomLegendPanel />
            <GenerateMoviePanel />
          </div>
          {isBulkEditingMode ? (
            <div className="bg-black/90 w-full h-full absolute left-0 top-0 flex flex-row items-center justify-end px-3" />
          ) : null}
        </div>
      </div>
    </div>
  );
}
