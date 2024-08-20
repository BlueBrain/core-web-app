import { useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { RESET } from 'jotai/utils';
import dynamic from 'next/dynamic';

import {
  genericSingleNeuronSimulationPlotDataAtom,
  simulationStatusAtom,
} from '@/state/simulate/single-neuron';

const PlotRenderer = dynamic(
  () => import('@/components/simulate/single-neuron/visualization/PlotRenderer'),
  {
    ssr: false,
  }
);

export default function Results() {
  const [recordingPlotData, setRecordingPlotData] = useAtom(genericSingleNeuronSimulationPlotDataAtom);
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
    <div className='flex flex-col gap-2 w-full'>
      {Object.entries(recordingPlotData).map(([key, value], index) => {
        return (
          <div key={key} className='flex flex-col items-start justify-start w-full'>
            <div className='px-4 py-2 text-white text-base bg-primary-8 flex items-center justify-center'>{index+1}</div>
            <div className="flex flex-col border border-gray-300 w-full p-2">
              <h2 className='font-bold text-lg text-left text-primary-8'>{key}</h2>
              <PlotRenderer
                className="mt-8"
                data={value}
                isLoading={isLoading}
                plotConfig={{
                  yAxisTitle: 'Voltage, mV',
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )

  // return (
  //   plotData && (
  //     <PlotRenderer
  //       className="mt-8"
  //       data={plotData}
  //       isLoading={isLoading}
  //       plotConfig={{
  //         yAxisTitle: 'Voltage, mV',
  //       }}
  //     />
  //   )
  // );
}
