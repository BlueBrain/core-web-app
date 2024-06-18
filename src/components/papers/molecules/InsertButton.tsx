import { ReactNode } from 'react';
import { classNames } from '@/util/utils';

export default function InsertButton({
  icon,
  label,
  className,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  className: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={classNames(
        'flex h-11 w-40 min-w-max items-center justify-between gap-2 rounded-none px-3 py-2 text-primary-8',
        'border border-gray-200 hover:bg-gray-200',
        className
      )}
      onClick={onClick}
    >
      <span className="text-primary-8">{label}</span>
      {icon}
    </button>
  );
}
