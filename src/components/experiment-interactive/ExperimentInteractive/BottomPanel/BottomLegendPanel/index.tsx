'use client';

import { useAtomValue } from 'jotai';
import { displayedSimulationParamsConfigAtom } from '@/state/experiment-interactive';

export default function BottomLegendPanel() {
  const displayedSimulationParamsConfig = useAtomValue(displayedSimulationParamsConfigAtom);

  return (
    <div className="w-full justify-start items-start gap-8 inline-flex p-5">
      {displayedSimulationParamsConfig.map(({ paramKey, color }) => (
        <div className="justify-start items-center gap-1.5 flex" key={paramKey}>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <div className="text-white text-xs font-semibold leading-none tracking-tight truncate max-w-[100px]">
            {paramKey}
          </div>
        </div>
      ))}
    </div>
  );
}
