import { useAtomValue } from 'jotai';
import dynamic from 'next/dynamic';

import { simulationPlotDataAtom } from '@/state/simulate/single-neuron';

const SimTracePlot = dynamic(
  () => import('@/components/simulate/single-neuron/visualization/SimTracePlot'),
  {
    ssr: false,
    loading: () => <>Loading...</>,
  }
);

export default function Results() {
  const plotData = useAtomValue(simulationPlotDataAtom);

  if (!plotData?.length)
    return (
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="text-4xl">No results to display</div>
        <div>
          Click on <strong>simulate</strong> button
        </div>
      </div>
    );

  return plotData && <SimTracePlot className="mt-8" data={plotData} />;
}
