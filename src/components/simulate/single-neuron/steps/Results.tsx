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

  const isLoading =
    simulationStatus?.status === 'launched' &&
    Object.values(recordingPlotData).every((o) => o.every((p) => p.y.length === 0));

  return (
    <div className="flex w-full flex-col gap-2">
      {Object.entries(recordingPlotData).map(([key, value]) => {
        return (
          <div key={key} className="flex w-full flex-col items-start justify-start">
            <PlotRenderer
              withTitle
              bordered
              title={key}
              type="simulation"
              name={key}
              isDownloadable={!!value.length}
              onlyAmplitudeLegend={false}
              data={value.map((v, i) => ({ ...v, line: { color: SIMULATION_COLORS[i] } }))}
              isLoading={isLoading}
              className="min-h-[320px] w-full"
              plotConfig={{
                yAxisTitle: 'Voltage [mV]',
                showDefaultLegends: true,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
