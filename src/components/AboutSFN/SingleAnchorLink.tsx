'use client';

import { useState } from 'react';

import { classNames } from '@/util/utils';
import Link from 'next/link';

export default function SingleAnchorLink({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  const [isMouseHover, setIsMouseHover] = useState<boolean>(false);

  return (
    <Link
      href={href}
      className={classNames('relative flex flex-row items-center gap-x-4', className)}
      onMouseOver={() => setIsMouseHover(true)}
      onFocus={() => setIsMouseHover(false)}
      onMouseOut={() => setIsMouseHover(false)}
      onBlur={() => setIsMouseHover(false)}
    >
      <div
        className={classNames(
          'relative block h-3 w-3 rounded-full transition-colors duration-200 ease-linear',
          isMouseHover ? 'bg-white' : 'bg-primary-5'
        )}
      />
      <h6
        className={classNames(
          'font-sans text-base font-normal transition-opacity duration-300 ease-linear',
          isMouseHover ? 'opacity-100' : 'opacity-0'
        )}
      >
        {label}
      </h6>
    </Link>
  );
}
