'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import Link from 'next/link';

import { classNames } from '@/util/utils';

export default function SingleAnchorLink({
  href,
  label,
  className,
  isVisible,
  siblingHover,
  onSiblingHover,
}: {
  href: string;
  label: string;
  isVisible: boolean;
  className?: string;
  siblingHover: string | null;
  onSiblingHover: Dispatch<SetStateAction<string | null>>;
}) {
  const [isMouseHover, setIsMouseHover] = useState<boolean>(false);

  const onHover = () => {
    setIsMouseHover(true);
    onSiblingHover(href);
  };

  const onLeave = () => {
    setIsMouseHover(false);
    onSiblingHover(null);
  };

  return (
    <Link
      href={href}
      className={classNames('relative flex h-4 flex-row items-center gap-x-4', className)}
      onMouseOver={onHover}
      onFocus={onLeave}
      onMouseOut={onLeave}
      onBlur={onLeave}
    >
      <div
        className={classNames(
          'relative block h-3 w-3 rounded-full transition-colors duration-200 ease-linear',
          isMouseHover || isVisible ? 'scale-125 transform bg-white' : 'bg-primary-5'
        )}
      />
      <h6
        className={classNames(
          'relative font-sans text-sm font-normal uppercase tracking-wider transition-opacity duration-300 ease-linear',
          'rotate-180 transform whitespace-nowrap text-center [writing-mode:vertical-lr]',
          isMouseHover ? 'opacity-100' : 'opacity-0',
          !siblingHover && isVisible && 'opacity-100',
          siblingHover && siblingHover !== href && 'hidden'
        )}
      >
        {label}
      </h6>
    </Link>
  );
}
