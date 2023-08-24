import { useAtomValue } from 'jotai';

import { simulationDurationAtom } from '@/state/experiment-interactive';

export default function TimeRange() {
  const simulationDuration = useAtomValue(simulationDurationAtom);

  return (
    <div className="flex justify-between w-full items-center text-white/70">
      <div className="text-left">0 ms</div>
      <div className="text-right">{simulationDuration} ms</div>
    </div>
  );
}
