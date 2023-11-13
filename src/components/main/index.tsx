'use client';

import ApplicationSidebar, {
  DefaultAccountPanel,
  NavigationItem,
  NavigationItemProps,
} from '../ApplicationSidebar';
import { OBPLogo } from '../Entrypoint/segments/Splash';
import MainMenu from './Menu';
import { basePath } from '@/config';
import { classNames } from '@/util/utils';
import MainMenu from './Menu';

function MainSideBarHeader({ expanded }: { expanded: boolean }) {
  return expanded ? <span>OBP</span> : <span>Menu</span>;
}

export const MAIN_NAVIGATION_LIST: Array<NavigationItemProps> = [
  {
    name: 'Discover',
    description:
      'Explore each brain region and discover all the experimental data, virtual experiments targeting these regions and the literature associated to those.',
    url: '/discover',
    bgcolor: 'bg-primary-5',
  },
  {
    name: 'About',
    description: 'Explore the literature and query publications using a chatbot.',
    url: '/about',
    bgcolor: 'bg-primary-6',
  },
];

function MainNavigation({ expanded }: { expanded: boolean }) {
  return (
    <ul
      className={classNames(
        'w-full h-full flex items-start justify-start gap-y-1 flex-col overflow-y-auto primary-scrollbar',
        !expanded && 'hidden'
      )}
    >
      {MAIN_NAVIGATION_LIST.map(({ name, url, description, bgcolor }) => (
        <NavigationItem key={url} {...{ name, url, description, bgcolor }} />
      ))}
    </ul>
  );
}

export default function Main() {
  return (
    <div className={classNames('relative bg-primary-9 h-full')}>
      <div
        className="fixed bg-primary-9 inset-0 w-full h-full min-h-screen z-0 bg-blend-lighten bg-no-repeat bg-center [background-size:70%]"
        style={{
          backgroundImage: `url(${basePath}/images/obp_fullbrain_backdroped.png)`,
        }}
      />
      <div className="fixed left-0 z-20">
        <ApplicationSidebar title={MainSideBarHeader} control={MainNavigation} />
      </div>
      <OBPLogo color="text-primary-5" className="!left-14" />
      <div className="fixed top-[130px] left-[53px] max-w-[250px] w-full z-10">
        <DefaultAccountPanel expanded />
      </div>
      <div className="absolute h-[calc(100vh-56px)] top-7 right-7 flex justify-end w-[calc(100%-3rem)] ml-auto">
        <MainMenu />
      </div>
    </div>
  );
}
