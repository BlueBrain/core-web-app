'use client';

import { useState } from 'react';

import { useSetAtom } from 'jotai';
import { classNames } from '@/util/utils';
import { searchConfigListTypeAtom } from '@/state/simulate';

type Hashes =
  | '#'
  | '#simulate-templates'
  | '#simulate-runs'
  | '#simulate-public'
  | '#simulate-personal';

type SimulatePageSections = {
  text: string;
  hash: Hashes;
};

const sectionLinksMap: SimulatePageSections[] = [
  { text: 'All', hash: '#' },
  { text: 'Templates', hash: '#simulate-templates' },
  { text: 'Simulation campaigns run rtatus', hash: '#simulate-runs' },
  { text: 'Public simulation campaigns', hash: '#simulate-public' },
  { text: 'My simulation campaigns', hash: '#simulate-personal' },
];

export default function SectionLinks() {
  const [currentHref, setCurrentHref] = useState('');
  const searchType = useSetAtom(searchConfigListTypeAtom);

  const handleClick = (hash: Hashes) => {
    if (hash === '#simulate-personal') {
      searchType('personal');
    }
    if (hash === '#simulate-public') {
      searchType('public');
    }
    setCurrentHref(hash);
  };

  const isActive = (hash: string) => {
    // For 'All' section
    if (currentHref === '' && hash === '#') return true;
    return currentHref.endsWith(hash);
  };

  return (
    <div className="sticky left-0 top-5 mt-10 flex flex-col">
      {sectionLinksMap.map(({ text, hash }) => (
        <a
          href={hash}
          key={text}
          className={classNames('text-l mt-2', isActive(hash) ? 'text-primary-3' : '')}
          onClick={() => handleClick(hash)}
        >
          {text}
        </a>
      ))}
    </div>
  );
}
