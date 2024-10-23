'use client';

import Link from 'next/link';
import { useState } from 'react';

import { CONTRIBUTORS } from '@/constants/home/content-home';
import { ContributorProps, CONTRIBUTORS_LIST } from '@/constants/home/contributors-list';
import { classNames } from '@/util/utils';

export function SingleContributorCard({ name, link }: { name: string; link: string }) {
  const [onMouseHover, setOnMouseHover] = useState(false);

  return (
    <Link
      href={link}
      className="relative font-sans text-xl font-semibold text-white"
      onMouseOver={() => setOnMouseHover(true)}
      onFocus={() => setOnMouseHover(true)}
      onMouseOut={() => setOnMouseHover(false)}
      onBlur={() => setOnMouseHover(false)}
    >
      <div
        className="relative z-10 transition-all duration-300 ease-out-expo"
        style={{ left: onMouseHover ? '-10px' : '0' }}
      >
        {name}
      </div>
      <div className="absolute left-0 z-0 h-12 w-24 -translate-x-8 -translate-y-[32px] bg-primary-6 transition-height duration-300 ease-out-expo">
        <div
          className="relative h-full w-1/2 bg-primary-8 transition-all duration-300 ease-out-expo"
          style={{ width: onMouseHover ? '100%' : '0' }}
        />
      </div>
    </Link>
  );
}

export function LoadButton({
  onClick,
  label,
  type,
}: {
  onClick: () => void;
  label: string;
  type: 'load' | 'unload';
}) {
  return (
    <button
      type="button"
      aria-label="Load 25 more contributors's name"
      onClick={onClick}
      className={classNames(
        'relative flex items-center justify-center rounded-full border border-solid border-primary-4 px-16 py-4 font-sans text-xl font-semibold',
        type === 'load' ? 'text-white' : 'text-primary-4'
      )}
    >
      {label}
    </button>
  );
}

export default function ScreenContributors() {
  const [displayedNameNumber, setDisplayedNameNumber] = useState(20);

  const handleLoadTwentyFiveMore = () => {
    if (displayedNameNumber >= CONTRIBUTORS_LIST.length) return;
    setDisplayedNameNumber(displayedNameNumber + 25);

    window.scrollBy({
      top: 200,
      left: 0,
      behavior: 'smooth',
    });
  };

  const handleUnloadTwentyFiveLess = () => {
    setDisplayedNameNumber(displayedNameNumber - 25);

    window.scrollBy({
      top: -200,
      left: 0,
      behavior: 'smooth',
    });
  };

  const handleCollapseAll = () => {
    setDisplayedNameNumber(25);
  };

  return (
    <div className="relative flex min-h-screen w-screen snap-start snap-always flex-col items-center gap-y-6 pb-56 pt-[24vh]">
      <div className="grid w-full grid-cols-2 gap-x-6 px-[16vw] font-title">
        <h3 className="text-7xl font-bold text-white">{CONTRIBUTORS.title}</h3>
        <h4 className="text-4xl font-normal text-primary-2">{CONTRIBUTORS.subtitle}</h4>
      </div>
      <div className="relative left-8 mb-12 mt-20 grid w-full grid-cols-5 gap-x-4 gap-y-20 px-[8vw]">
        {CONTRIBUTORS_LIST.slice(0, displayedNameNumber).map(
          (contributor: ContributorProps, index) => (
            <SingleContributorCard
              key={`Contributor-${contributor.last_name}_Card_${index + 1}`}
              name={contributor.full_name}
              link="#"
            />
          )
        )}
      </div>
      {displayedNameNumber === CONTRIBUTORS_LIST.length ? (
        <LoadButton type="load" label="Collapse" onClick={handleCollapseAll} />
      ) : (
        <div className="flex flex-row gap-x-6">
          {displayedNameNumber > 25 && (
            <LoadButton type="unload" label="Show 25 less" onClick={handleUnloadTwentyFiveLess} />
          )}
          <LoadButton type="load" label="Load 25 more" onClick={handleLoadTwentyFiveMore} />
        </div>
      )}
    </div>
  );
}
