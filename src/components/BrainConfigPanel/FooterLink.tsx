import { PropsWithChildren } from 'react';

import Link from '@/components/Link';
import { classNames } from '@/util/utils';

type FooterLinkProps = {
  className?: string;
  href: string;
};

export default function FooterLink({
  href,
  children,
  className,
}: PropsWithChildren<FooterLinkProps>) {
  return (
    <Link className={classNames('flex items-center justify-between p-3', className)} href={href}>
      {children}
    </Link>
  );
}
