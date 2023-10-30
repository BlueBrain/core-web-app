import { CSSProperties, ReactNode, useState, useEffect } from 'react';
import { Popover } from 'antd';

type PositionConfig = {
  x: number;
  y: number;
};

type PositionedPoptipProps = {
  config: PositionConfig;
  children: ReactNode;
};

const PopoverTarget = {
  WIDTH: 72,
  HEIGHT: 12,
};

export function PositionedPoptip({ config, children }: PositionedPoptipProps) {
  const [hoverTargetHidden, setHoverTargetHidden] = useState<boolean>(true);

  useEffect(() => setHoverTargetHidden(false), [config]);

  const containerStyle = {
    left: `${config.x - PopoverTarget.WIDTH / 2}px`,
    top: `${config.y - 8}px`,
  };

  const hoverTargetStyle: CSSProperties = {
    width: PopoverTarget.WIDTH,
    height: hoverTargetHidden ? 0 : PopoverTarget.HEIGHT,
  };

  return (
    <div className="fixed" style={containerStyle}>
      <Popover content={children} trigger="hover" align={{ offset: [0, 0] }}>
        <div style={hoverTargetStyle} onMouseLeave={() => setHoverTargetHidden(true)} />
      </Popover>
    </div>
  );
}
