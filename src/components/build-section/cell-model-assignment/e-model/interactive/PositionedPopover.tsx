import { ReactNode } from 'react';
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
  WIDTH: 16,
  HEIGHT: 4,
};

export function PositionedPoptip({ config, children }: PositionedPoptipProps) {
  const containerStyle = {
    left: `${config.x - PopoverTarget.WIDTH / 2}px`,
    top: `${config.y - PopoverTarget.HEIGHT / 2}px`,
  };

  const targetStyle = {
    width: PopoverTarget.WIDTH,
    height: PopoverTarget.HEIGHT,
  };

  return (
    <div className="fixed" style={containerStyle}>
      <Popover
        content={children}
        trigger="hover"
        align={{ offset: [0, -PopoverTarget.HEIGHT / 2] }}
      >
        <div style={targetStyle} />
      </Popover>
    </div>
  );
}
