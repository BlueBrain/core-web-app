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
        'primary-scrollbar flex h-full w-full flex-col items-start justify-start gap-y-1 overflow-y-auto',
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
    <div className={classNames('relative h-full bg-primary-9')}>
      <div
        className="fixed inset-0 z-0 h-full min-h-screen w-full bg-primary-9 bg-center bg-no-repeat bg-blend-lighten [background-size:70%]"
        style={{
          backgroundImage: `url(${basePath}/images/obp_fullbrain_backdroped.png)`,
        }}
      />
      <div className="fixed left-0 z-20">
        <ApplicationSidebar title={MainSidebarHeader} account={null} navigation={null}>
          {({ expanded }) => <MainNavigation {...{ expanded }} />}
        </ApplicationSidebar>
      </div>

      <div className="grid h-screen grid-cols-[1fr_3fr] justify-end gap-x-2 py-5 pl-14 pr-7">
        <div className="flex w-full flex-col gap-y-7">
          <OBPLogo color="text-white" />
          <div className="z-10 w-90percent">
            <DefaultAccountPanel expanded />
          </div>
        </div>
        <MainMenu />
      </div>
    </div>
  );
}
