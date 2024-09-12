'use client';

import { classNames } from '@/util/utils';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginButton({
  link,
  label,
  type = 'link',
  action,
  className,
}: {
  link?: string;
  label: string;
  type: 'link' | 'button';
  action?: () => void;
  className?: string;
}) {
  const globalStyle = 'flex h-16 w-44 items-center bg-primary-8 pl-6 text-base';

  const [isMouseHover, setIsMouseHover] = useState<boolean>(false);

  return type === 'link' ? (
    !!link && (
      <Link
        onMouseOver={() => setIsMouseHover(true)}
        onFocus={() => setIsMouseHover(false)}
        onMouseOut={() => setIsMouseHover(false)}
        onBlur={() => setIsMouseHover(false)}
        href={link}
        className={classNames(globalStyle, className)}
      >
        <div
          className={classNames(
            'relative z-10 transition-colors duration-300 ease-linear',
            isMouseHover ? 'text-primary-9' : 'text-white'
          )}
        >
          {label}
        </div>
        <div
          className={classNames(
            'transition-width absolute left-0 z-0 h-full bg-white duration-300 ease-in-out',
            isMouseHover ? 'w-full' : 'w-0'
          )}
        />
      </Link>
    )
  ) : (
    <button type="button" onClick={action} className={classNames(globalStyle, className)}>
      <div
        className={classNames(
          'z-10 transition-colors duration-300 ease-linear',
          isMouseHover ? 'text-primary-9' : 'text-white'
        )}
      >
        {label}
      </div>
      <div
        className={classNames(
          'transition-width absolute left-0 z-0 h-full bg-white duration-300 ease-in-out',
          isMouseHover ? 'w-full' : 'w-0'
        )}
      />
    </button>
  );
}
