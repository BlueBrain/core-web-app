import { useAtomValue, useSetAtom } from 'jotai';
import { useMemo } from 'react';

import FrameMarker from './FrameMarker';
import {
  playbackActiveStepAtom,
  simulationAnnotationsAtom,
  simulationDataAtom,
} from '@/state/experiment-interactive';
import { MAX_STEP_TICKS } from '@/components/experiment-interactive/config';
import {
  calculatePercentX,
  getTickPositions,
} from '@/components/experiment-interactive/ExperimentInteractive/BottomPanel/PlaybackPanel/utils';

export default function TimeMarkers() {
  const { stepCount } = useAtomValue(simulationDataAtom);
  const setPlaybackActiveStep = useSetAtom(playbackActiveStepAtom);
  const simulationAnnotations = useAtomValue(simulationAnnotationsAtom);

  const tickPositions = useMemo(() => getTickPositions(stepCount, MAX_STEP_TICKS), [stepCount]);

  const annotationMarks = useMemo(
    () =>
      simulationAnnotations.map(({ step, text, color = 'text-green-400' }) => (
        <div
          key={`${step}_${text}`}
          className={`w-full absolute ${color}`}
          style={{ transform: `translate(${calculatePercentX(step, stepCount)}%, -2px)` }}
        >
          <FrameMarker onClick={() => setPlaybackActiveStep(step)} description={text} />
        </div>
      )),
    [setPlaybackActiveStep, simulationAnnotations, stepCount]
  );

  return (
    <div className="relative mb-2.5 w-full left-1/2 -translate-x-1/2">
      {tickPositions.map((tickPosition) => (
        <div
          key={tickPosition}
          className="w-full absolute border-l border-white/70 h-1.5"
          style={{ transform: `translate(${tickPosition}%)` }}
        />
      ))}

      <div className="absolute w-full -translate-y-1">{annotationMarks}</div>
    </div>
  );
}
