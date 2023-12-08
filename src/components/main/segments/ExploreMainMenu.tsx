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
      'Explore each brain region and discover all the experimental data, virtual experiments targeting these regions and the literature associated to those.',
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
    description: 'Explore the literature and query publications using a chatbot.',
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
    <div className="relative w-full bg-black group h-1/2 box-border">
      <Image
        priority
        src={img.src}
        alt={kebabCase(name)}
        className={classNames('object-cover', classname)} // 'hidden lg:block'
        width={img.width}
        height={img.height}
      />
      <div className="absolute h-full top-0 px-5 py-3 lg:p-7 text-white flex flex-col gap-2 w-2/3 lg:w-1/3">
        <h1 className="font-bold text-xl xl:text-3xl 2xl:text-4xl">{name}</h1>
        <p className="mb-1 font-normal text-sm xl:text-lg 2xl:text-xl">{description}</p>
        <Link
          href={url}
          className="relative w-max py-2 xl:py-4 px-7 text-white border border-white text-center text-base lg:text-lg 2xl:text-2xl hover:text-primary-8 hover:bg-white hover:font-bold"
        >
          {btnLabel}
        </Link>
      </div>
    </div>
  );
}

export default function ExploreMainMenu() {
  return (
    <div className="w-full flex flex-col h-full items-center gap-1 overflow-hidden">
      {EXPLORE_NAVIGATION_LIST.map(({ name, description, url, img, btnLabel, classname }) => (
        <ExploreMainMenuItem
          key={kebabCase(`main-${name}-${url}`)}
          {...{ name, description, url, img, btnLabel, classname }}
        />
      ))}
    </div>
  );
}
