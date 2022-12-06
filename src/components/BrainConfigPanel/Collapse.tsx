import { useState, PropsWithChildren } from 'react';
import { RightOutlined, DownOutlined } from '@ant-design/icons';

import { classNames } from '@/util/utils';

type CollapseProps = {
  title: string;
  defaultCollapsed?: boolean;
  className?: string;
};

export default function Collapse({
  title,
  children,
  defaultCollapsed,
  className,
}: PropsWithChildren<CollapseProps>) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(!!defaultCollapsed);

  return (
    <div className={className}>
      <button
        className="w-full flex justify-between items-center text-primary-3"
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className={classNames('text-lg', !isCollapsed ? 'text-white' : '')}>{title}</span>

        {isCollapsed ? <RightOutlined /> : <DownOutlined />}
      </button>

      {!isCollapsed && <div className="mt-4">{children}</div>}
    </div>
  );
}
