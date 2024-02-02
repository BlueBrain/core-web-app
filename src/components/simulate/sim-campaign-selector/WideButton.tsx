import { PlusOutlined } from '@ant-design/icons';
import { ReactNode } from 'react';

interface WideButtonProps {
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
}

export function WideButton({
  title,
  description,
  icon = <PlusOutlined />,
  className = 'bg-primary-8',
}: WideButtonProps) {
  return (
    <button type="button" className={`flex w-full items-start justify-between p-8 ${className}`}>
      <div className="flex flex-col items-start gap-2 text-left">
        <h3 className="text-2xl font-bold">{title}</h3>
        <div className="max-w-[400px] text-primary-3">{description}</div>
      </div>
      {icon}
    </button>
  );
}
