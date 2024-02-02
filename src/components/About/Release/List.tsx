'use client';

import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { useParams } from 'next/navigation';

import FilledCalendar from '@/components/icons/FilledCalendar';
import { classNames } from '@/util/utils';
import { basePath } from '@/config';

export type Release = {
  id: string;
  version: string;
  date: Date;
  title: string;
  description: string;
  image: string;
  width: number;
  height: number;
};

export function ReleaseCard({
  id,
  title,
  description,
  image: src,
  width,
  height,
  date,
  version,
}: Release) {
  const params = useParams();
  const releaseId = params?.['release-id'];
  const selected = releaseId === id;
  return (
    <div
      id={`release-${id}`}
      className="relative flex h-full snap-start flex-col border-x bg-[#0027661a] backdrop-blur-[2px] hover:shadow-md"
    >
      <Image alt={title} src={`${basePath}${src}`} {...{ width, height }} />
      <div
        className={classNames(
          'flex w-full flex-col p-4 transition-background duration-200 ease-out',
          selected && 'bg-primary-8'
        )}
      >
        <div className="inline-flex items-center justify-between gap-2 py-2">
          <div className="text-sm font-light text-primary-8">Release {version}</div>
          <div className="grid grid-flow-col items-center justify-center gap-1">
            <FilledCalendar className="text-primary-8" />
            <span className="text-sm text-primary-8">{format(new Date(date), 'dd.MM.yyyy')}</span>
          </div>
        </div>
        <h3 className="line-clamp-2 py-2 text-xl font-bold text-primary-8">{title}</h3>
        <p className="line-clamp-4 text-sm font-light text-primary-8">{description}</p>
        <Link
          href={`/about/releases/${id}`}
          className="relative mt-9 flex w-max flex-col items-center px-2 text-base font-normal text-primary-8"
        >
          Read more
          <div className="absolute bottom-0 h-[2px] w-4/5 bg-primary-8" />
        </Link>
      </div>
    </div>
  );
}
