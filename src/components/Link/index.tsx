'use client';

import { PropsWithChildren } from 'react';
import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';

type LinkProps = {
  href: string;
  className?: string;
  style?: React.CSSProperties;
  preserveLocationSearchParams?: boolean;
  preservedSearchParamKeys?: string[];
};

/**
 * A wrapper for Next.js Link component that can preserve search params from current location
 */
export default function Link({
  href,
  className,
  children,
  style,
  preserveLocationSearchParams = false,
  preservedSearchParamKeys,
}: PropsWithChildren<LinkProps>) {
  const locationSearchParams = useSearchParams();

  const linkSearchParamsStr = href.match(/\?(.*)$/)?.[1] ?? '';
  const linkSearchParams = new URLSearchParams(linkSearchParamsStr);

  if (preserveLocationSearchParams && locationSearchParams) {
    Array.from(locationSearchParams.entries()).forEach(([key, value]) => {
      if (linkSearchParams.has(key)) return;

      if (preservedSearchParamKeys && !preservedSearchParamKeys.includes(key)) return;

      linkSearchParams.set(key, value);
    });
  }

  const searchParamsStr = Array.from(linkSearchParams.keys()).length
    ? `?${linkSearchParams.toString()}`
    : '';

  const hrefWLocationSearchParams = href.includes('?')
    ? href.replace(/\?.*$/, searchParamsStr)
    : `${href}${searchParamsStr}`;

  return (
    <NextLink className={className} href={hrefWLocationSearchParams} style={style}>
      {children}
    </NextLink>
  );
}
