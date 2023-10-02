import { useAtomValue } from 'jotai';
import { displayedSimulationParamsConfigAtom } from '@/state/experiment-interactive';
import { SimulationParameterValues } from '@/components/experiment-interactive/types';
import ParamLabel from '@/components/experiment-interactive/ExperimentInteractive/MainPanel/SimulationGrid/SimulationBox.backup/BoxLegend/ParamLabel';

interface BoxLegendProps {
  index: number;
  simParams: SimulationParameterValues;
}

export default function BoxLegend({ index, simParams }: BoxLegendProps) {
  const displayedSimulationParamsConfig = useAtomValue(displayedSimulationParamsConfigAtom);

  return (
    <div className="w-56 h-4 justify-start items-center gap-3 inline-flex absolute left-0 top-0 m-2">
      <div className="font-bold text-white/50">{index}</div>
      <div className="flex flex-row gap-4">
        {displayedSimulationParamsConfig.map(({ paramKey, color }) => (
          <div className="justify-start items-center gap-1.5 flex" key={paramKey}>
            <ParamLabel value={simParams[paramKey]} paramKey={paramKey} color={color} />
          </div>
        ))}
      </div>
    </div>
  );
}
