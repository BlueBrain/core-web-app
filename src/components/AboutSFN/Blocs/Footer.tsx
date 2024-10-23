import Link from 'next/link';

import { OBPLogo } from '@/components/Entrypoint/segments/Splash';
import { classNames } from '@/util/utils';

type SingleSectionProps = {
  title: string;
  items: {
    title: string;
    url: string;
  }[];
};

const content = [
  {
    title: 'The foundation',
    items: [
      {
        title: 'Link 1',
        url: '#',
      },
      {
        title: 'Link 2',
        url: '#',
      },
      {
        title: 'Link 3',
        url: '#',
      },
      {
        title: 'Link 4',
        url: '#',
      },
    ],
  },
  {
    title: 'Resources',
    items: [
      {
        title: 'Blue Brain Github',
        url: 'https://github.com/BlueBrain',
      },
      {
        title: 'Blue Brain Open data',
        url: 'https://registry.opendata.aws/',
      },
      {
        title: 'Neocortical Microcircuit Collaboration Portal',
        url: 'https://bbp.epfl.ch/nmc-portal/welcome.html',
      },
      {
        title: 'Blue Brain Project',
        url: 'https://www.epfl.ch/research/domains/bluebrain/',
      },
    ],
  },
  {
    title: 'More',
    items: [
      {
        title: 'Link 1',
        url: '#',
      },
      {
        title: 'Link 2',
        url: '#',
      },
      {
        title: 'Link 3',
        url: '#',
      },
      {
        title: 'Link 4',
        url: '#',
      },
    ],
  },
];

export default function Footer({ className }: { className?: string }) {
  return (
    <div
      className={classNames(
        'relative flex w-full flex-row items-start justify-between border-t border-solid border-primary-4 px-[8vw] pb-20 pt-32',
        className
      )}
    >
      <OBPLogo color="text-white" />
      <div className="relative flex w-2/3 flex-row justify-between gap-x-10">
        {content.map((section: SingleSectionProps, index: number) => (
          <div
            key={`Footer_element-${section.title}-${index + 1}`}
            className="flex flex-col gap-y-3"
          >
            <h4 className="text-xl font-semibold uppercase tracking-[0.06em] text-white">
              {section.title}
            </h4>
            {section.items.map((item: { title: string; url: string }, idx: number) => (
              <Link
                key={`link_${item.title}-${idx + 1}`}
                href={item.url}
                className="font-sans text-xl font-light leading-normal text-white transition-colors duration-300 ease-linear hover:text-primary-3"
              >
                {item.title}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
