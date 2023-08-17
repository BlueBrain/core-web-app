'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import TextContentPortals from './TextContentPortals';
import { Portals } from '@/constants/explore-section/portals-content';
import { ArrowRightIcon } from '@/components/icons';
import { classNames } from '@/util/utils';

export default function PortalItem({ content }: { content: Portals }) {
  const [mouseStatus, setMouseStatus] = useState<boolean>(false);

  return (
    <Link
      href={content.url}
      className={classNames(
        'relative w-full h-48 p-3 flex flex-row items-center justify-between rounded transition-background duration-300 ease-linear',
        mouseStatus ? 'bg-primary-7' : 'bg-primary-8'
      )}
      onMouseOver={() => setMouseStatus(true)}
      onFocus={() => setMouseStatus(true)}
      onMouseOut={() => setMouseStatus(false)}
      onBlur={() => setMouseStatus(false)}
    >
      <div className="w-90percent h-full flex flex-row items-center">
        {/* Image */}
        <div className="w-48 h-full overflow-hidden shadow-strongImage bg-primary-2">
          <Image
            src={content.image}
            alt={content.name}
            width={400}
            height={400}
            className="w-full h-auto"
          />
        </div>

        <TextContentPortals content={content} />
      </div>

      <div className="relative w-10percent h-4 flex items-center justify-center mr-5 overflow-hidden">
        <ArrowRightIcon
          className={classNames(
            'absolute text-white w-auto h-3 transition-right duration-500 ease-in-out',
            mouseStatus ? 'right-0' : '-right-8'
          )}
        />
      </div>
    </Link>
  );
}
