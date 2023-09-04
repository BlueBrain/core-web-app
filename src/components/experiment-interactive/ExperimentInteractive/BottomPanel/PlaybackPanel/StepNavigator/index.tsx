import { useCallback } from 'react';
import { useAtom, useAtomValue } from 'jotai';

import BackwardStep from '@/components/icons/BackwardStep';
import NumberInput from '@/components/experiment-interactive/ExperimentInteractive/NumberInput';
import ForwardStep from '@/components/icons/ForwardStep';
import { playbackActiveStepAtom, simulationDataAtom } from '@/state/experiment-interactive';

export default function StepNavigator() {
  const { stepCount } = useAtomValue(simulationDataAtom);
  const [playbackActiveStep, setPlaybackActiveStep] = useAtom(playbackActiveStepAtom);

  const stepBackwards = useCallback(
    () => setPlaybackActiveStep((prev) => (prev > 0 ? prev - 1 : prev)),
    [setPlaybackActiveStep]
  );

  const stepForward = useCallback(
    () => setPlaybackActiveStep((prev) => (prev < stepCount ? prev + 1 : prev)),
    [setPlaybackActiveStep, stepCount]
  );

  return (
    <div className="inline-flex items-center gap-3 flex">
      <button type="button" onClick={stepBackwards}>
        <BackwardStep />
      </button>
      <div>
        <NumberInput
          value={playbackActiveStep}
          className="font-bold"
          onChange={(value) => (value <= stepCount ? setPlaybackActiveStep(value) : null)}
          min={0}
          max={stepCount}
        />
        / {stepCount}
      </div>
      <button type="button" onClick={stepForward}>
        <ForwardStep />
      </button>
    </div>
  );
}
