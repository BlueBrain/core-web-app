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

function MainSidebarHeader({ expanded }: { expanded: boolean }) {
  return expanded ? <span>OBP</span> : <span>Menu</span>;
}

export const MAIN_NAVIGATION_LIST: Array<NavigationItemProps> = [
  {
    name: 'About',
    description: 'Explore the literature and query publications using a chatbot.',
    url: '/about',
    bgcolor: 'bg-primary-6',
  },
];

export function MainNavigation({ expanded }: { expanded: boolean }) {
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
        <ApplicationSidebar
          title={MainSidebarHeader}
          control={MainNavigation}
          account={null}
          navigation={null}
        />
      </div>

      <div className="h-screen pr-7 pl-14 py-5 justify-end gap-x-2 grid grid-cols-[1fr_3fr]">
        <div className="flex flex-col w-full gap-y-7">
          <OBPLogo color="text-white" />
          <div className="w-90percent z-10">
            <DefaultAccountPanel expanded />
          </div>
        </div>
        <MainMenu />
      </div>
    </div>
  );
}
