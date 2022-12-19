'use client';

import { PropsWithChildren } from 'react';
import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';

import { basePath } from '@/config';

type LinkProps = {
  href: string;
  className?: string;
  style?: React.CSSProperties;
  preserveCurrentSearchParams?: boolean;
  overwriteSearchParamsWithCurrent?: boolean;
};

export default function Link({
  href,
  className,
  children,
  style,
  preserveCurrentSearchParams = true,
  overwriteSearchParamsWithCurrent = false,
}: PropsWithChildren<LinkProps>) {
  const currentSearchParams = useSearchParams();
  const linkSearchParams = new URLSearchParams(href.match(/\?(.*)$/)?.[1] ?? '');

  if (preserveCurrentSearchParams) {
    Array.from(currentSearchParams.entries()).forEach(([key, value]) => {
      if (linkSearchParams.has(key) && !overwriteSearchParamsWithCurrent) return;

      linkSearchParams.set(key, value);
    });
  }

  const modifiedHref = href.includes('?')
    ? href.replace(/\?.*$/, `?${linkSearchParams.toString()}`)
    : `${href}?${linkSearchParams.toString()}`;

  return (
    <NextLink className={className} href={`${basePath}${modifiedHref}`} style={style} shallow>
      {children}
    </NextLink>
  );
}
