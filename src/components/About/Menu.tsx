'use client';

import Link from 'next/link';

import { classNames } from '@/util/utils';
import usePathname from '@/hooks/pathname';

type MainMenuListKey =
  | 'about-entry'
  | 'releases-entry'
  | 'roadmap-entry'
  | 'documentation-entry'
  | null;

type MenuItem = {
  id: NonNullable<MainMenuListKey>;
  title: string;
  url: string;
  description: string;
  bgcolor: string;
  selected: 'equal' | 'start-with';
};

const MENU_LIST: Array<MenuItem> = [
  {
    id: 'about-entry',
    title: 'About',
    url: '/about',
    description: 'Lorem irure in consequat sit consequat ipsum sint elit.',
    bgcolor: 'bg-primary-5',
    selected: 'equal',
  },
  {
    id: 'releases-entry',
    title: 'Releases',
    url: '/about/releases',
    description: 'Sint elit incididunt in excepteur culpa exercitation enim velit duis.',
    bgcolor: 'bg-primary-6',
    selected: 'start-with',
  },
  {
    id: 'roadmap-entry',
    title: 'Roadmap',
    url: '/about/roadmap',
    description:
      'Do officia esse ipsum nisi sit nisi sunt sunt occaecat esse labore elit ipsum eiusmod.',
    bgcolor: 'bg-primary-7',
    selected: 'start-with',
  },
  {
    id: 'documentation-entry',
    url: '/about/docs',
    title: 'Documentation',
    description:
      'Do officia esse ipsum nisi sit nisi sunt sunt occaecat esse labore elit ipsum eiusmod.',
    bgcolor: 'bg-primary-8',
    selected: 'start-with',
  },
];

export function MenuSingleItem({ id, title, url, description, bgcolor, selected }: MenuItem) {
  const path = usePathname();
  const current = selected === 'equal' ? path === url : path?.startsWith(url);

  return (
    <Link
      id={id}
      href={url}
      className={classNames(
        'py-4 px-5 hover:bg-white text-left group flex-1 basis-1/3',
        bgcolor,
        current && 'bg-white shadow-lg'
      )}
    >
      <h3
        className={classNames(
          'text-lg font-bold group-hover:text-primary-8',
          current ? 'text-primary-8' : 'text-white'
        )}
      >
        {title}
      </h3>
      <p
        className={classNames(
          'line-clamp-2 text-sm font-normal group-hover:text-primary-8',
          current ? 'text-primary-8' : 'text-white'
        )}
      >
        {description}
      </p>
    </Link>
  );
}

export default function AboutMenu() {
  return (
    <div className="inline-flex items-stretch justify-between gap-x-1 gap-y-4 sticky top-0 z-20 bg-primary-8">
      {MENU_LIST.map(({ id, title, url, description, bgcolor, selected }) => (
        <MenuSingleItem
          key={id}
          {...{
            id,
            url,
            title,
            description,
            bgcolor,
            selected,
          }}
        />
      ))}
    </div>
  );
}
