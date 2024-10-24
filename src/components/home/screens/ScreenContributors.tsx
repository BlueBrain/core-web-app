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
      className="relative"
      onMouseOver={() => setOnMouseHover(true)}
      onFocus={() => setOnMouseHover(true)}
      onMouseOut={() => setOnMouseHover(false)}
      onBlur={() => setOnMouseHover(false)}
    >
      <div
        className="relative z-10 font-sans text-lg font-semibold leading-tight text-white transition-all duration-300 ease-out-expo"
        style={{ left: onMouseHover ? '-10px' : '0' }}
      >
        {name}
      </div>
      <div
        className="absolute left-0 z-0 h-12 -translate-x-8 -translate-y-[32px] bg-primary-6 transition-width duration-500 ease-out-expo"
        style={{ width: onMouseHover ? '72px' : '46px' }}
      />
    </Link>
  );
}

export function LoadButton({
  onClick,
  label,
  type,
}: {
  onClick: (type: 'more' | 'less') => void;
  label: string;
  type: 'more' | 'less';
}) {
  return (
    <button
      type="button"
      aria-label="Load 25 more contributors's name"
      onClick={() => onClick(type)}
      className={classNames(
        'relative flex items-center justify-center rounded-full px-16 py-4 font-sans text-xl font-semibold',
        type === 'more' ? 'border border-solid border-primary-4 text-white' : 'text-primary-4'
      )}
    >
      {label}
    </button>
  );
}

export default function ScreenContributors() {
  const [displayedNameNumber, setDisplayedNameNumber] = useState(20);

  const handleNameDisplay = (type: 'more' | 'less') => {
    if (type === 'more') {
      if (displayedNameNumber >= CONTRIBUTORS_LIST.length) return;
      setDisplayedNameNumber(displayedNameNumber + 25);

      window.scrollBy({
        top: 200,
        left: 0,
        behavior: 'smooth',
      });
    } else {
      if (displayedNameNumber <= 25) return;
      setDisplayedNameNumber(displayedNameNumber - 25);

      window.scrollBy({
        top: -200,
        left: 0,
        behavior: 'smooth',
      });
    }
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
      <div className="relative left-8 mb-12 mt-20 grid w-full grid-cols-5 gap-x-12 gap-y-20 px-[8vw]">
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
        <LoadButton type="more" label="Collapse" onClick={handleCollapseAll} />
      ) : (
        <div className="flex flex-col gap-y-2">
          <LoadButton type="more" label="Load 25 more" onClick={handleNameDisplay} />
          {displayedNameNumber > 25 && (
            <LoadButton type="less" label="Show 25 less" onClick={handleNameDisplay} />
          )}
        </div>
      )}
    </div>
  );
}
