'use client';

import { useAtomValue } from 'jotai';
import { displayedSimulationParamsConfigAtom } from '@/state/experiment-interactive';

export default function BottomLegendPanel() {
  const displayedSimulationParamsConfig = useAtomValue(displayedSimulationParamsConfigAtom);

  return (
    <div className="inline-flex w-full items-start justify-start gap-8 p-5">
      {displayedSimulationParamsConfig.map(({ paramKey, color }) => (
        <div className="flex items-center justify-start gap-1.5" key={paramKey}>
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
          <div className="max-w-[100px] truncate text-xs font-semibold leading-none tracking-tight text-white">
            {paramKey}
          </div>
        </div>
      ))}
    </div>
  );
}
