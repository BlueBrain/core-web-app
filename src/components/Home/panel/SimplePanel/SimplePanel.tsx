'use client';

import Link from '@/components/Link';
import { AddThinIcon } from '@/components/icons';
import { classNames } from '@/util/utils';

export type SimplePanelProps = {
  className?: string;
  title: string;
  link: string;
  children: React.ReactNode;
};


export default function SimplePanel({ className, title, link, children }: SimplePanelProps) {
  return (
    <Link className={classNames("p-5 flex flex-col justify-start items-stretch cursor-pointer", className)} href={link}>
      <header className="flex flex-row justify-between items-center text-3xl leading-tight">
        <div className="flex-auto font-bold text-3xl">{title}</div>
        <AddThinIcon iconColor='white' className="w-auto h-5" />
      </header>
      <div className="font-light leading-normal">{children}</div>
    </Link>
  );
}
