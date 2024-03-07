import Link from 'next/link';
import { ReactNode } from 'react';

export type LinkItem = {
  key: string;
  content: string | ReactNode;
  href: string;
};

type Props = {
  links: LinkItem[];
  current?: string;
};

export default function VerticalLinks({ links, current }: Props) {
  return (
    <div className="flex h-fit w-full flex-col border border-primary-7">
      {links.map((link, idx) => (
        <Link
          key={link.key}
          href={link.href}
          className={`border-primary-7 py-4 font-bold ${current === link.key && 'bg-neutral-1 text-primary-8'} ${idx !== links.length - 1 && 'border-b'}`}
        >
          <div className="mx-4">{link.content}</div>
        </Link>
      ))}
    </div>
  );
}
