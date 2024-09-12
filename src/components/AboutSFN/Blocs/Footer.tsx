import Link from 'next/link';

import { OBPLogo } from '@/components/Entrypoint/segments/Splash';

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
    title: 'Contact',
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
    title: 'Documentation',
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

export default function Footer() {
  return (
    <div className="relative flex w-full flex-row items-start justify-between border-t border-solid border-primary-4 pb-20 pt-32">
      <OBPLogo color="text-white" />
      <div className="relative flex w-2/3 flex-row justify-between gap-x-10">
        {content.map((section: SingleSectionProps) => (
          <div key={`Footer_element-${section.title}`} className="flex flex-col gap-y-3">
            <h4 className="text-xl font-semibold uppercase tracking-[0.06em]">{section.title}</h4>
            {section.items.map((item: { title: string; url: string }) => (
              <Link
                key={`link_${item.title}`}
                href={item.url}
                className="font-sans text-xl font-light leading-normal"
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
