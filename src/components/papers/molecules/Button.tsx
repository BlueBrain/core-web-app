import React, { ComponentProps, ReactNode } from 'react';
import { classNames } from '@/util/utils';

type Props = ComponentProps<'button'> & {
  label?: ReactNode;
  icon?: ReactNode;
  showLabel?: boolean;
  active?: boolean;
};

export default function EditorButton({
  disabled,
  onClick,
  title,
  className,
  'aria-label': arialLabel,
  label,
  icon,
  active,
  showLabel = false,
  type = 'button',
  ...props
}: Props) {
  return (
    <button
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      disabled={disabled}
      onClick={onClick}
      title={title}
      aria-label={arialLabel}
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={classNames(
        'flex h-8 min-w-8 cursor-pointer items-center justify-center gap-1 rounded-none border-0 bg-none p-1 align-middle',
        'disabled:cursor-not-allowed',
        '[&>svg]:h-6 [&>svg]:w-6',
        'hover:bg-gray-200',
        'hover:[&>svg]:text-blue-700',
        active && 'bg-gray-200 [&>svg]:h-7 [&>svg]:w-7 [&>svg]:text-gray-900',
        className
      )}
    >
      {icon && icon}
      {showLabel && label && <span className="pr-2 text-sm">{label}</span>}
    </button>
  );
}
