'use client';

import Link from 'next/link';
import { ArrowLeftOutlined } from '@ant-design/icons';

import ApplicationSidebar, {
  NavigationItem,
  NavigationItemProps,
} from '@/components/ApplicationSidebar';
import { OBPLogo } from '@/components/Entrypoint/segments/Splash';
import { EXPLORE_NAVIGATION_LIST } from '@/components/explore-section/Sidebar';
import { classNames } from '@/util/utils';
import { EyeIcon } from '@/components/icons';

function MainSideBarHeader({ expanded }: { expanded: boolean }) {
  return expanded ? <span>Discover</span> : <span>Menu</span>;
}

export function DiscoverNavigationItem({
  url,
  name,
  description,
}: Omit<NavigationItemProps, 'bgcolor'>) {
  return (
    <li
      key={url}
      className={classNames(
        'flex mx-auto px-4 py-5 cursor-pointer relative w-full bg-white hover:bg-primary-7 group'
      )}
    >
      <Link href={url} className="w-full mx-auto">
        <h1 className="text-xl font-bold group-hover:text-white text-primary-8">{name}</h1>
        <p
          title={description}
          className="select-none mt-1 text-left font-thin text-sm line-clamp-2 mb-3 text-neutral-4 w-2/3 group-hover:text-white"
        >
          {description}
        </p>
      </Link>
      <EyeIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-8 group-hover:text-white" />
    </li>
  );
}

function DiscoverNavigation() {
  return (
    <ul className="w-full h-full flex items-start justify-start gap-y-1 flex-col overflow-y-auto primary-scrollbar">
      {EXPLORE_NAVIGATION_LIST.map(({ name, description, url }) => (
        <DiscoverNavigationItem key={url} {...{ name, description, url }} />
      ))}
    </ul>
  );
}

function MainNavigation({ expanded }: { expanded: boolean }) {
  return (
    <ul
      className={classNames(
        'w-full h-full flex items-start justify-start gap-y-1 flex-col overflow-y-auto primary-scrollbar',
        !expanded && 'hidden'
      )}
    >
      {EXPLORE_NAVIGATION_LIST.map(({ name, url, description, bgcolor }) => (
        <NavigationItem key={url} {...{ name, url, description, bgcolor }} />
      ))}
    </ul>
  );
}

export default function Main() {
  return (
    <div className={classNames('relative bg-primary-9 h-full')}>
      <div className="fixed bg-primary-9 inset-0 w-full h-full min-h-screen z-0 bg-fullbrain-image bg-blend-lighten bg-no-repeat bg-center [background-size:70%]" />
      <div className="fixed left-0 z-20">
        <ApplicationSidebar title={MainSideBarHeader} control={MainNavigation} />
      </div>
      <OBPLogo color="text-primary-5" className="!left-14" />
      <div className="fixed top-[130px] left-[53px] max-w-[250px] w-full z-10">
        <Link href="/" className="inline-flex items-center gap-1 group">
          <ArrowLeftOutlined className="text-white w-5 h-5 group-hover:text-primary-4" />
          <span className="text-white text-base font-bold group-hover:text-primary-4">
            Back to Home
          </span>
        </Link>
      </div>
      <div className="absolute h-[calc(100vh-56px)] top-7 right-7 flex justify-end w-3/5 ml-auto z-20">
        <DiscoverNavigation />
      </div>
    </div>
  );
}
