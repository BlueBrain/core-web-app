'use client';

import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { useParams } from 'next/navigation';

import FilledCalendar from '@/components/icons/FilledCalendar';
import { classNames } from '@/util/utils';

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
      className="snap-start flex flex-col relative h-full border-x bg-[#0027661a] backdrop-blur-[2px] hover:shadow-md"
    >
      <Image alt={title} {...{ src, width, height }} />
      <div
        className={classNames(
          'flex flex-col w-full p-4 transition-background duration-200 ease-out',
          selected && 'bg-primary-8'
        )}
      >
        <div className="inline-flex items-center justify-between gap-2 py-2">
          <div className="text-sm font-light text-primary-8">Release {version}</div>
          <div className="grid grid-flow-col gap-1 items-center justify-center">
            <FilledCalendar className="text-primary-8" />
            <span className="text-primary-8 text-sm">{format(new Date(date), 'dd.MM.yyyy')}</span>
          </div>
        </div>
        <h3 className="text-xl font-bold text-primary-8 line-clamp-2 py-2">{title}</h3>
        <p className="text-sm font-light text-primary-8 line-clamp-4">{description}</p>
        <Link
          href={`/about/releases/${id}`}
          className="text-base font-normal relative w-max px-2 flex flex-col items-center text-primary-8 mt-9"
        >
          Read more
          <div className="h-[2px] bg-primary-8 w-4/5 absolute bottom-0" />
        </Link>
      </div>
    </div>
  );
}
