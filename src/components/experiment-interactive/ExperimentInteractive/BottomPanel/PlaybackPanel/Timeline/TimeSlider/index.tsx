import { useAtom, useAtomValue } from 'jotai';
import { DndContext, DragMoveEvent } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import round from 'lodash/round';
import ceil from 'lodash/ceil';

import { adjustIndicatorPosition, calculatePercentX, restrictToParentElement } from '../../utils';
import ActiveStepIndicator from './ActiveStepIndicator';
import TimeAxis from './TimeAxis';
import { playbackActiveStepAtom, simulationDataAtom } from '@/state/experiment-interactive';

export default function TimeSlider() {
  const { stepCount } = useAtomValue(simulationDataAtom);

  const [playbackActiveStep, setPlaybackActiveStep] = useAtom(playbackActiveStepAtom);

  useEffect(() => {
    setActiveStep(playbackActiveStep);
  }, [playbackActiveStep]);

  const [activeStep, setActiveStep] = useState(playbackActiveStep);

  const playbackActiveStepPercentX = useMemo(
    () => calculatePercentX(playbackActiveStep, stepCount),
    [playbackActiveStep, stepCount]
  );

  const activeStepPercentX = useMemo(
    () => calculatePercentX(activeStep, stepCount),
    [activeStep, stepCount]
  );

  const onDragMove = useCallback(
    (event: DragMoveEvent) => {
      const target = event.activatorEvent.target as HTMLDivElement;
      const barWidth = target.offsetParent?.clientWidth ?? 1;
      const positionX = target.offsetLeft + event.delta.x + 8;
      const percentX = round(positionX / barWidth, 5);
      const dragStep = ceil(percentX * stepCount);
      setActiveStep(dragStep);
    },
    [stepCount]
  );

  const onDragEnd = useCallback(() => {
    setPlaybackActiveStep(activeStep);
  }, [activeStep, setPlaybackActiveStep]);

  const handleAxisClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const targetRect = (event.target as HTMLDivElement).getBoundingClientRect();
      const { clientX } = event;
      const innerOffsetLeft = clientX - targetRect.left;
      const percentLeft = round(innerOffsetLeft / targetRect.width, 3);
      const closestStep = round(percentLeft * stepCount);
      setActiveStep(closestStep);
      setPlaybackActiveStep(closestStep);
    },
    [setPlaybackActiveStep, stepCount]
  );

  return (
    <div className="w-full relative h-5" onClick={handleAxisClick} role="presentation">
      <TimeAxis />

      <DndContext
        id="time-slider"
        modifiers={[restrictToParentElement, restrictToHorizontalAxis, adjustIndicatorPosition]}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
      >
        <div className="absolute w-full left-1/2 -translate-x-1/2 top-[6px] pointer-events-none">
          <div className="bg-white h-[5px] left-0" style={{ width: `${activeStepPercentX}%` }} />
        </div>
        <div className="bg-white/20 w-full absolute">
          <ActiveStepIndicator stepX={playbackActiveStepPercentX} />
        </div>
      </DndContext>
    </div>
  );
}
