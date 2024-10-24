'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowNorthEastIcon } from '../icons';

type ExternalLinkProps = {
  label: string;
  url: string;
  hasIcon: boolean;
  theme: 'light' | 'dark';
};

export default function PrimaryButtonHome({
  label,
  url,
  hasIcon = false,
  theme,
}: ExternalLinkProps) {
  const [isMouseHover, setIsMouseHover] = useState(false);

  let textColor;

  switch (theme) {
    case 'light':
      textColor = isMouseHover ? '#fff' : '#002766';
      break;
    case 'dark':
      textColor = isMouseHover ? '#002766' : '#fff';
      break;
    default:
      textColor = isMouseHover ? '#fff' : '#002766';
  }

  return (
    <Link
      href={url}
      className="relative flex h-14 w-[200px] flex-row items-center px-4"
      style={{
        color: textColor,
        background: theme === 'light' ? '#fff' : '#003A8C',
        justifyContent: hasIcon ? 'space-between' : 'start',
      }}
      onMouseOver={() => setIsMouseHover(true)}
      onFocus={() => setIsMouseHover(true)}
      onMouseOut={() => setIsMouseHover(false)}
      onBlur={() => setIsMouseHover(false)}
      aria-label={`Button link to ${label}`}
    >
      <div className="text-base! relative z-10 font-semibold">{label}</div>
      {hasIcon && <ArrowNorthEastIcon iconColor="#40A9FF" className="relative z-10" />}
      <div
        className="absolute left-0 top-0 z-0 h-14 transition-width duration-500 ease-out"
        style={{
          width: isMouseHover ? '100%' : '0%',
          background: theme === 'light' ? '#003A8C' : '#fff',
        }}
      />
    </Link>
  );
}
