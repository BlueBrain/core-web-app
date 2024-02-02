import { CSS } from '@dnd-kit/utilities';
import { useDraggable } from '@dnd-kit/core';

/* eslint-disable react/jsx-props-no-spreading */

interface ActiveStepIndicatorProps {
  stepX: number;
}

export default function ActiveStepIndicator({ stepX }: ActiveStepIndicatorProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'active-step-indicator',
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      className="absolute top-[1px] h-[15px] w-[15px] -translate-x-[7px] rounded bg-white"
      style={{ left: `calc(${stepX}%)`, ...style }}
      {...listeners}
      {...attributes}
    />
  );
}
