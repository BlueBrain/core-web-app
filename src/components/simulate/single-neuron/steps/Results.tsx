import { useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { RESET } from 'jotai/utils';
import dynamic from 'next/dynamic';

import {
  genericSingleNeuronSimulationPlotDataAtom,
  simulationStatusAtom,
} from '@/state/simulate/single-neuron';
import { SIMULATION_COLORS } from '@/constants/simulate/single-neuron';

const PlotRenderer = dynamic(
  () => import('@/components/simulate/single-neuron/visualization/PlotRenderer'),
  {
    ssr: false,
  }
);

export default function Results() {
  const [recordingPlotData, setRecordingPlotData] = useAtom(
    genericSingleNeuronSimulationPlotDataAtom
  );
  const simulationStatus = useAtomValue(simulationStatusAtom);

  useEffect(() => {
    return () => {
      setRecordingPlotData(RESET);
    };
  }, [setRecordingPlotData]);

  if (!recordingPlotData || !Object.keys(recordingPlotData).length) {
    return (
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="text-4xl">No results to display</div>
        <div>
          Click on <strong>simulate</strong> button
        </div>
      </div>
    );
  }

  // plotData with one element is a placeholder to show something
  // in the plot when we launched simulation but still processing
  const isLoading = simulationStatus?.status === 'launched';
  return (
    <div className="flex w-full flex-col gap-2">
      {Object.entries(recordingPlotData).map(([key, value]) => {
        return (
          <div key={key} className="flex w-full flex-col items-start justify-start">
            <div className="flex items-center justify-center bg-primary-8 px-4 py-2 text-base text-white">
              {key}
            </div>
            <div className="flex w-full flex-col border border-gray-300 p-2">
              <PlotRenderer
                className="mt-8"
                data={value.map((v, i) => ({ ...v, line: { color: SIMULATION_COLORS[i] } }))}
                isLoading={isLoading}
                plotConfig={{
                  yAxisTitle: 'Voltage [mv]',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
