import { useState } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface ParamLabelProps {
  color: string;
  value: number;
  paramKey: string;
}

export default function ParamLabel({ color, value, paramKey }: ParamLabelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <Tooltip.Provider>
      <Tooltip.Root open={isOpen}>
        <Tooltip.Trigger
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="focus-visible:outline-none"
        >
          <div className="flex flex-row items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <div className="text-white text-xs font-semibold">{value}</div>
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-white text-black text-xs p-2 max-w-[170px] break-all focus-visible:outline-none"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            side="bottom"
          >
            {paramKey}
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
