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
    title: 'Blue Brain Project',
    items: [
      {
        title: 'The Blue Brain Project',
        url: 'https://www.epfl.ch/research/domains/bluebrain/',
      },
      {
        title: 'Blue Brain Portal',
        url: 'https://portal.bluebrain.epfl.ch/',
      },
      {
        title: "Project's timeline",
        url: 'https://www.epfl.ch/research/domains/bluebrain/blue-brain/about/timeline/',
      },
    ],
  },
  // {
  //   title: 'Contact',
  //   items: [
  //     {
  //       title: 'Link 1',
  //       url: '#',
  //     },
  //     {
  //       title: 'Link 2',
  //       url: '#',
  //     },
  //     {
  //       title: 'Link 3',
  //       url: '#',
  //     },
  //     {
  //       title: 'Link 4',
  //       url: '#',
  //     },
  //   ],
  // },
  {
    title: 'Documentation',
    items: [
      {
        title: 'Blue Brain Nexus',
        url: 'https://bluebrainnexus.io/',
      },
      {
        title: 'Channelpedia',
        url: 'https://channelpedia.epfl.ch/',
      },
      {
        title: 'NMC portal',
        url: 'https://bbp.epfl.ch/nmc-portal/welcome.html',
      },
      {
        title: 'Hippocampus Hub',
        url: 'https://www.hippocampushub.eu/',
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
    <div className="relative mt-[30vh] flex h-[50vh] w-full snap-start flex-row items-start justify-between border-t border-solid border-primary-4 px-[16vw] pb-20 pt-32">
      <OBPLogo color="text-white" />
      <div className="relative flex w-2/3 flex-row justify-between gap-x-10">
        {content.map((section: SingleSectionProps, index: number) => (
          <div
            key={`Footer_element-${section.title}-${index + 1}`}
            className="flex flex-col gap-y-3"
          >
            <h4 className="text-xl font-semibold uppercase tracking-[0.06em]">{section.title}</h4>
            {section.items.map((item: { title: string; url: string }, idx: number) => (
              <Link
                key={`link_${item.title}-${idx + 1}`}
                href={item.url}
                className="font-sans text-xl font-light leading-normal text-white transition-colors duration-200 ease-linear hover:text-primary-4"
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
