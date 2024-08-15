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
  const [plotData, setPlotData] = useAtom(genericSingleNeuronSimulationPlotDataAtom);
  const simulationStatus = useAtomValue(simulationStatusAtom);

  useEffect(() => {
    return () => {
      setPlotData(RESET);
    };
  }, [setPlotData]);

  if (!plotData?.length) {
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
    plotData && (
      <PlotRenderer
        className="mt-8"
        data={plotData}
        isLoading={isLoading}
        plotConfig={{
          yAxisTitle: 'Voltage, mV',
        }}
      />
    )
  );
}
