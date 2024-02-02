import Image from 'next/image';
import Link from 'next/link';
import kebabCase from 'lodash/kebabCase';
import { basePath } from '@/config';
import { classNames } from '@/util/utils';

type ExploreMainMenuProps = {
  name: string;
  btnLabel: string;
  description: string;
  url: string;
  classname: string;
  img: {
    src: string;
    width: number;
    height: number;
  };
};

export const EXPLORE_NAVIGATION_LIST: Array<ExploreMainMenuProps> = [
  {
    name: 'Interactive exploration',
    description:
      'Explore brain regions, experimental data, and virtual experiments targeting these regions.',
    url: '/explore/interactive',
    img: {
      src: `${basePath}/images/obp_whole_brain.webp`,
      width: 1158,
      height: 794,
    },
    btnLabel: 'Start exploring',
    classname: 'h-full w-1/2 absolute top-0 right-0',
  },
  {
    name: 'Knowledge discovery',
    description: 'Find scholarly articles and query publications from open-access sources.',
    url: '/explore/literature',
    img: {
      src: `${basePath}/images/obp_knowledge_discovery.webp`,
      width: 2108,
      height: 822,
    },
    btnLabel: 'Start discovering',
    classname: 'h-full w-full',
  },
];

function ExploreMainMenuItem({
  name,
  description,
  url,
  img,
  btnLabel,
  classname,
}: ExploreMainMenuProps) {
  return (
    <div className="group relative box-border h-1/2 w-full bg-black">
      <Image
        priority
        src={img.src}
        alt={kebabCase(name)}
        className={classNames('object-cover', classname)} // 'hidden lg:block'
        width={img.width}
        height={img.height}
      />
      <div className="absolute top-0 flex h-full w-2/3 flex-col gap-2 px-5 py-3 text-white lg:w-1/3 lg:p-7">
        <h1 className="text-xl font-bold xl:text-3xl 2xl:text-4xl">{name}</h1>
        <p className="mb-1 text-sm font-normal xl:text-lg 2xl:text-xl">{description}</p>
        <Link
          href={url}
          className="relative w-max border border-white px-7 py-2 text-center text-base text-white hover:bg-white hover:font-bold hover:text-primary-8 lg:text-lg xl:py-4 2xl:text-2xl"
        >
          {btnLabel}
        </Link>
      </div>
    </div>
  );
}

export default function ExploreMainMenu() {
  return (
    <div className="flex h-full w-full flex-col items-center gap-1 overflow-hidden">
      {EXPLORE_NAVIGATION_LIST.map(({ name, description, url, img, btnLabel, classname }) => (
        <ExploreMainMenuItem
          key={kebabCase(`main-${name}-${url}`)}
          {...{ name, description, url, img, btnLabel, classname }}
        />
      ))}
    </div>
  );
}
