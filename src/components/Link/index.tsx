import { UrlObject } from 'url';
import { PropsWithChildren } from 'react';
import NextLink from 'next/link';

import { basePath } from '@/config';

type LinkProps = {
  href: string | UrlObject;
  className?: string;
};

export default function Link({ href, className, children }: PropsWithChildren<LinkProps>) {
  return (
    <NextLink className={className} href={`${basePath}${href}`} shallow>
      {children}
    </NextLink>
  );
}
