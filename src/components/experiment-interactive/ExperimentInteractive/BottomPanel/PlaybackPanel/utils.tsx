import { Transform } from '@dnd-kit/utilities';
import { ClientRect, Modifier } from '@dnd-kit/core';
import round from 'lodash/round';
import ceil from 'lodash/ceil';
import range from 'lodash/range';

export function restrictToBoundingRect(
  transform: Transform,
  rect: ClientRect,
  boundingRect: ClientRect,
  margin: number
): Transform {
  const value = {
    ...transform,
  };

  if (rect.left + transform.x <= boundingRect.left) {
    value.x = boundingRect.left - rect.left;
  } else if (rect.right + transform.x >= boundingRect.left + boundingRect.width + margin) {
    value.x = boundingRect.left + boundingRect.width - rect.right + margin;
  }

  return value;
}

export const restrictToParentElement: Modifier = ({
  containerNodeRect,
  draggingNodeRect,
  transform,
}) => {
  if (!draggingNodeRect || !containerNodeRect) {
    return transform;
  }

  return restrictToBoundingRect(transform, draggingNodeRect, containerNodeRect, 15);
};

export const adjustIndicatorPosition: Modifier = ({ transform }) => ({
  ...transform,
  x: transform.x - 8,
});

export function calculatePercentX(step: number, stepCount: number): number {
  return round((100 * step) / stepCount, 5);
}

export function calculateStepsPerTick(stepCount: number, maxTicks: number): number {
  let stepsPerTick = -1;
  let order = 10;
  const rawStepsPerTick = stepCount / maxTicks;

  while (stepsPerTick < 0) {
    if (rawStepsPerTick / order <= 1) {
      stepsPerTick = order;
    } else {
      order *= order.toString().startsWith('5') ? 10 : 5;
    }
  }

  return stepsPerTick;
}

export function calculateTickCount(stepCount: number, stepsPerTick: number): number {
  return ceil(stepCount / stepsPerTick);
}

export function getTickPositions(stepCount: number, maxTicks: number): number[] {
  const stepsPerTick = calculateStepsPerTick(stepCount, maxTicks);
  const tickCount = calculateTickCount(stepCount, stepsPerTick) + 1;
  return range(tickCount).map((tick) => calculatePercentX(tick * stepsPerTick, stepCount));
}
