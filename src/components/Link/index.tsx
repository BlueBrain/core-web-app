import { UrlObject } from 'url';
import { PropsWithChildren } from 'react';
import NextLink from 'next/link';

import { basePath } from '@/config';

type LinkProps = {
  href: string | UrlObject;
  className?: string;
  style?: React.CSSProperties;
};

export default function Link({ href, className, children, style }: PropsWithChildren<LinkProps>) {
  return (
    <NextLink className={className} href={`${basePath}${href}`} style={style} shallow>
      {children}
    </NextLink>
  );
}
