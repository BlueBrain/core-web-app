import { useAtom } from 'jotai';

import NumberInput from '@/components/experiment-interactive/ExperimentInteractive/NumberInput';
import { playbackStepSizeAtom } from '@/state/experiment-interactive';

export default function StepSize() {
  const [playbackStepSize, setPlaybackStepSize] = useAtom(playbackStepSizeAtom);

  return (
    <div className="flex flex-row gap-2">
      Step size
      <NumberInput
        value={playbackStepSize}
        onChange={setPlaybackStepSize}
        unit="ms"
        size={2}
        min={1}
      />
    </div>
  );
}
