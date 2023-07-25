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
    <button type="button" className={`flex justify-between items-start p-8 w-full ${className}`}>
      <div className="flex flex-col items-start gap-2 text-left">
        <h3 className="font-bold text-2xl">{title}</h3>
        <div className="text-primary-3 max-w-[400px]">{description}</div>
      </div>
      {icon}
    </button>
  );
}
