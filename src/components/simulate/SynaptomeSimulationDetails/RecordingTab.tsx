import { useState } from 'react';
import SimulationPlotAsImage from '@/components/explore-section/MEModel/DetailView/SimulationPlotAsImage';
import { PlotData } from '@/services/bluenaas-single-cell/types';
import { classNames } from '@/util/utils';

type Props = {
  recordings: Record<string, PlotData>;
};

export default function RecordingTab({ recordings }: Props) {
  const [currentRecording, setCurrentRecording] = useState<number>(0);
  const totalRecordings = Object.keys(recordings).length;
  return (
    <div className="mx-auto flex w-full justify-center">
      <div className="mt-6 w-fit min-w-[700px] text-center">
        {Array(totalRecordings)
          .fill(0)
          .map((_, i) => (
            <button
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className={classNames(
                'mr-3 h-6 w-6 border border-gray-300 text-primary-8',
                i === currentRecording && 'bg-primary-8 text-white'
              )}
              onClick={() => setCurrentRecording(i)}
              type="button"
            >
              {i + 1}
            </button>
          ))}

        <div>
          {Object.keys(recordings).map(
            (recording, index) =>
              index === currentRecording && (
                <div key={recording} className="my-6">
                  <SimulationPlotAsImage title={recording} plotData={recordings[recording]} />
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}
