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
          className={`absolute w-full ${color}`}
          style={{ transform: `translate(${calculatePercentX(step, stepCount)}%, -2px)` }}
        >
          <FrameMarker onClick={() => setPlaybackActiveStep(step)} description={text} />
        </div>
      )),
    [setPlaybackActiveStep, simulationAnnotations, stepCount]
  );

  return (
    <div className="relative left-1/2 mb-2.5 w-full -translate-x-1/2">
      {tickPositions.map((tickPosition) => (
        <div
          key={tickPosition}
          className="absolute h-1.5 w-full border-l border-white/70"
          style={{ transform: `translate(${tickPosition}%)` }}
        />
      ))}

      <div className="absolute w-full -translate-y-1">{annotationMarks}</div>
    </div>
  );
}
