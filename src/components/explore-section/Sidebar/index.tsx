import { useAtomValue } from 'jotai';
import { ArrowRightOutlined } from '@ant-design/icons';

import { backToListPathAtom } from '@/state/explore-section/detail-view-atoms';
import { classNames } from '@/util/utils';
import usePathname from '@/hooks/pathname';
import Link from '@/components/Link';
import ApplicationSidebar from '@/components/ApplicationSidebar';

export type ExploreNav = {
  name: string;
  description: string;
  url: string;
  bgcolor: string;
};

export const EXPLORE_NAVIGATION_LIST: Array<ExploreNav> = [
  {
    name: 'Interactive exploration',
    description:
      'Explore each brain region and discover all the experimental data, virtual experiments targeting these regions and the literature associated to those.',
    url: '/explore/interactive',
    bgcolor: 'bg-primary-5',
  },
  {
    name: 'Literature',
    description: 'Explore the literature and query publications using a chatbot.',
    url: '/explore/literature',
    bgcolor: 'bg-primary-6',
  },
  {
    name: 'Portals',
    description: 'Explore our existing data portals.',
    url: '/explore/portals',
    bgcolor: 'bg-primary-7',
  },
  {
    name: 'Gallery',
    description: 'Explore our brain models visualizations.',
    url: '/explore/gallery',
    bgcolor: 'bg-primary-8',
  },
];

export function DetailsPageSideBackLink() {
  const pathName = usePathname();

  const backToListPath = useAtomValue(backToListPathAtom); // this uses the previous path atom for the back to list
  const activePrevPath = backToListPath || pathName?.substring(0, pathName.lastIndexOf('/')); // this condition checks if the back to list path atom is set, if not use default

  const isSimulation = pathName?.includes('/simulations/');
  const prevPath = isSimulation
    ? pathName?.substring(0, pathName.lastIndexOf('/simulations/'))
    : activePrevPath;

  return prevPath ? (
    <div className="bg-neutral-1 text-primary-8 w-10 font-bold h-full flex items-start justify-center">
      <Link
        className="whitespace-pre text-sm rotate-180 mt-5"
        href={prevPath}
        style={{ writingMode: 'vertical-rl' }}
      >
        Back to list
        <ArrowRightOutlined className="mt-6" />
      </Link>
    </div>
  ) : null;
}

function ExploreNavigationItem({ url, name, description, bgcolor }: ExploreNav) {
  return (
    <li
      key={url}
      className={classNames(
        'flex mx-auto p-4 cursor-pointer relative w-full hover:bg-primary-7',
        bgcolor
      )}
    >
      <Link href={url} className="w-full mx-auto">
        <h1 className="text-xl font-bold text-white">{name}</h1>
        <p
          title={description}
          className="select-none mt-1 text-left font-thin text-sm line-clamp-1 text-primary-4"
        >
          {description}
        </p>
      </Link>
    </li>
  );
}

function ExploreNavigation({ expanded }: { expanded: boolean }) {
  return (
    <ul
      className={classNames(
        'w-full h-full flex items-start justify-start gap-y-1 flex-col overflow-y-auto primary-scrollbar',
        !expanded && 'hidden'
      )}
    >
      {EXPLORE_NAVIGATION_LIST.map(({ name, url, description, bgcolor }) => (
        <ExploreNavigationItem key={url} {...{ name, url, description, bgcolor }} />
      ))}
    </ul>
  );
}

function ExploreSideBarHeader() {
  return <Link href="/explore">Explore</Link>;
}

export default function ExploreSidebar() {
  return <ApplicationSidebar title={ExploreSideBarHeader} control={ExploreNavigation} />;
}
