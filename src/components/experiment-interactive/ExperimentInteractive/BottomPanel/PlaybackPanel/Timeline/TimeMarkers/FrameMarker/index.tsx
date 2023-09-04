import { MouseEventHandler, useState } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface FrameMarkerProps {
  description?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function FrameMarker({ onClick, description }: FrameMarkerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    if (description) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <Tooltip.Provider delayDuration={2000}>
      <Tooltip.Root open={isOpen}>
        <Tooltip.Trigger
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="focus-visible:outline-none border-none bg-transparent -translate-x-1/2 p-3 -translate-y-2.5"
          onClick={onClick}
        >
          <svg
            width="12"
            height="11"
            viewBox="0 0 8 7"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.86603 6.5C4.48113 7.16667 3.51887 7.16667 3.13397 6.5L0.535899 2C0.150999 1.33333 0.632124 0.499999 1.40192 0.499999L6.59808 0.5C7.36788 0.5 7.849 1.33333 7.4641 2L4.86603 6.5Z"
              fill="currentColor"
            />
          </svg>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-white text-black text-xs p-2 max-w-[150px] break-all focus-visible:outline-none"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            side="top"
          >
            {description}
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
