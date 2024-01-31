import { useAtomValue } from 'jotai';
import { ArrowRightOutlined, HomeOutlined } from '@ant-design/icons';

import { useSession } from 'next-auth/react';
import { backToListPathAtom } from '@/state/explore-section/detail-view-atoms';
import { classNames } from '@/util/utils';
import usePathname from '@/hooks/pathname';
import Link from '@/components/Link';
import ApplicationSidebar, {
  AppNavigation,
  AppNavigationItem,
  DefaultAccountPanel,
  NavigationItem,
  NavigationItemProps,
} from '@/components/ApplicationSidebar';
import { MainNavigation } from '@/components/main';

export const EXPLORE_NAVIGATION_LIST: Array<NavigationItemProps> = [
  {
    name: 'Interactive exploration',
    description:
      'Explore each brain region and discover all the experimental data, virtual experiments targeting these regions and the literature associated to those.',
    url: '/explore/interactive',
    bgcolor: 'bg-primary-5',
  },
  {
    name: 'Knowledge discovery',
    description: 'Explore the literature and query publications using a chatbot.',
    url: '/explore/literature',
    bgcolor: 'bg-primary-6',
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
    <Link
      className="fixed pt-2 text-sm bg-neutral-1 text-primary-8 w-[40px] h-full flex flex-col items-center"
      href={prevPath}
    >
      <ArrowRightOutlined className="rotate-180 mt-1.5 mb-4" />
      <div style={{ writingMode: 'vertical-rl', rotate: '180deg' }}>Back to list</div>
    </Link>
  ) : null;
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
        <NavigationItem key={url} {...{ name, url, description, bgcolor }} />
      ))}
    </ul>
  );
}

function ExploreSideBarHeader() {
  return <Link href="/main?tab=explore">Explore</Link>;
}

function AnonymousExploreSideBarNavigation({ expanded }: { expanded: boolean }) {
  return (
    <div
      className={classNames(
        'w-full flex flex-col gap-y-1 my-2',
        expanded ? 'items-start' : 'items-center'
      )}
    >
      <AppNavigationItem
        showIconOnCollapse
        {...{
          expanded,
          title: 'Home',
          url: '/',
          icon: HomeOutlined,
        }}
      />
    </div>
  );
}

export default function ExploreSidebar() {
  const { status } = useSession();
  const Control = status === 'unauthenticated' ? MainNavigation : ExploreNavigation;
  const navigation =
    status === 'unauthenticated' ? AnonymousExploreSideBarNavigation : AppNavigation;
  const account = status === 'unauthenticated' ? null : DefaultAccountPanel;

  return (
    <ApplicationSidebar title={ExploreSideBarHeader} navigation={navigation} account={account}>
      {({ expanded }) => <Control {...{ expanded }} />}
    </ApplicationSidebar>
  );
}
