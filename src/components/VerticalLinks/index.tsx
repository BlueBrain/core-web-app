'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { useRouter, useSelectedLayoutSegment } from 'next/navigation';

import { Label } from '@/constants/virtual-labs/sidemenu';

export type GenericLinkItem = {
  key: string;
  href: string;
  label?: Label;
  styles?: string;
};

export type LinkItem = GenericLinkItem & {
  content: string | ReactNode;
  disabled?: boolean;
};

export type LabItem = GenericLinkItem & { id: string };

export type ProjectItem = LabItem & { virtualLabId: string };

type Props = {
  links: LinkItem[];
  currentPage?: string;
  virtualLabId?: string;
  projectId?: string;
};

export default function VerticalLinks({ virtualLabId, projectId, links, currentPage }: Props) {
  const { push } = useRouter();
  // TODO: make vlId and projectId mandaroty and use generateVlProjectUrl
  const onClick = (href: string) => () =>
    push(`/virtual-lab/lab/${virtualLabId}/project/${projectId}/${href}`);
  const selectedLayout = useSelectedLayoutSegment();

  return (
    <div className="flex h-fit w-full flex-col border border-primary-7">
      {links.map((link, idx) => {
        return virtualLabId && projectId ? (
          <button
            key={link.key}
            disabled={link.disabled}
            onClick={onClick(link.href)}
            type="button"
            className={`border-primary-7 py-4 text-left font-bold ${(selectedLayout === link.key || currentPage === link.key) && 'bg-neutral-1 text-primary-8'} ${idx !== links.length - 1 && 'border-b'}`}
          >
            <div className="mx-4">{link.content}</div>
          </button>
        ) : (
          <Link
            key={link.key}
            href={link.href}
            className={`border-primary-7 py-4 text-left font-bold ${(selectedLayout === link.key || currentPage === link.key) && 'bg-neutral-1 text-primary-8'} ${idx !== links.length - 1 && 'border-b'}`}
          >
            <div className="mx-4">{link.content}</div>
          </Link>
        );
      })}
    </div>
  );
}
