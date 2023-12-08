import { useReducer, useRef } from 'react';
import { Button } from 'antd';
import Link from 'next/link';
import kebabCase from 'lodash/kebabCase';
import Icon, {
  PlusOutlined,
  MinusOutlined,
  ArrowRightOutlined,
  UserOutlined,
  HomeOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import { signOut, useSession } from 'next-auth/react';

import VirtualLabsList from './VirtualLabsList';
import { classNames } from '@/util/utils';
import usePathname from '@/hooks/pathname';
import useOnClickOutside from '@/hooks/useOnClickOutside';

type TDefaulNavigation = {
  title: string;
  url: string;
  icon: React.ForwardRefExoticComponent<any>;
  showIconOnCollapse?: boolean;
  bgcolor?: string;
};

type ApplicationSidebarHeaderProps = {
  title: ({ expanded }: { expanded: boolean }) => React.ReactNode;
  expanded: boolean;
  toggleExpand: () => void;
};

type P = { expanded: boolean };
type ApplicationSidebarProps = {
  title: ({ expanded }: P) => React.ReactNode;
  control: ({ expanded }: P) => React.ReactNode;
  account?: (({ expanded }: P) => React.ReactNode) | null;
  navigation?: (({ expanded }: P) => React.ReactNode) | null;
};

export type NavigationItemProps = {
  name: string;
  description: string;
  url: string;
  bgcolor: string;
};

const DEFAULT_NAVIGATION: Array<TDefaulNavigation> = [
  {
    title: 'Home',
    url: '/',
    icon: HomeOutlined,
    showIconOnCollapse: true,
  },
  {
    url: '/explore/interactive',
    title: 'Explore',
    icon: ArrowRightOutlined,
    bgcolor: 'bg-primary-8',
  },
  {
    url: '/main?tab=build',
    title: 'Build',
    icon: ArrowRightOutlined,
    bgcolor: 'bg-primary-8',
  },
  {
    url: '/main?tab=simulate',
    title: 'Simulate',
    icon: ArrowRightOutlined,
    bgcolor: 'bg-primary-8',
  },
];

export function NavigationItem({ url, name, description, bgcolor }: NavigationItemProps) {
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

export function AppNavigationItem({
  expanded,
  title,
  bgcolor,
  url,
  icon,
  showIconOnCollapse,
}: TDefaulNavigation & { expanded: boolean }) {
  if (!expanded && showIconOnCollapse) {
    return (
      <Link href={url}>
        <Icon component={icon} title={title} className="text-primary-4 my-2" />
      </Link>
    );
  }
  return (
    <Link
      href={url}
      className={classNames(
        'w-full py-3 px-3 inline-flex flex-row items-center justify-between hover:bg-primary-7',
        bgcolor ?? 'bg-transparent',
        !expanded && 'hidden'
      )}
    >
      <div className="text-white text-base font-semibold">{title}</div>
      <Icon component={icon} title={title} className="text-white cursor-pointer" />
    </Link>
  );
}

export function AppNavigation({ expanded }: { expanded: boolean }) {
  return (
    <div
      className={classNames(
        'w-full flex flex-col gap-y-1 my-2',
        expanded ? 'items-start' : 'items-center'
      )}
    >
      {DEFAULT_NAVIGATION.map(({ title, url, icon, bgcolor, showIconOnCollapse }) => (
        <AppNavigationItem
          key={kebabCase(`${title}${url}`)}
          {...{ expanded, title, url, icon, bgcolor, showIconOnCollapse }}
        />
      ))}
    </div>
  );
}

export function DefaultAccountPanel({ expanded }: { expanded: boolean }) {
  const { data } = useSession();
  const userName = data?.user.name ?? data?.user.username ?? data?.user.email ?? '';
  const logout = () => signOut({ callbackUrl: '/' });
  if (!expanded) {
    return <UserOutlined title={userName} className="text-primary-4 text-base cursor-pointer" />;
  }
  return (
    <div
      className={classNames(
        'w-full border border-primary-7 my-0 bg-primary-9',
        !expanded && 'hidden',
        'hover:shadow-xl'
      )}
    >
      <div className="p-5 flex flex-col gap-y-2">
        <div className="inline-flex items-center justify-center gap-2 self-start">
          <UserOutlined title={userName} className="text-primary-4 text-base" />
          <span className="text-white font-bold">{userName}</span>
        </div>
        <div className="inline-flex flex-row items-center justify-between gap-2">
          <Link href="/account" className="text-primary-4 text-base font-normal hover:text-white">
            Account
          </Link>
          <button
            type="button"
            onClick={logout}
            className="text-primary-4 text-base cursor-pointer font-normal hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="h-px bg-primary-7 w-full" />
      <VirtualLabsList />
      <div className="h-px bg-primary-7 w-full" />

      <Link
        href="/virtual-lab/create/information"
        className="p-5 inline-flex items-center justify-between w-full"
      >
        <span className="text-white font-medium">Create virtual lab</span>
        <PlusSquareOutlined className="text-primary-4 w-4 h-4 text-base" />
      </Link>
    </div>
  );
}

function ApplicationSidebarHeader({
  title,
  expanded,
  toggleExpand,
}: ApplicationSidebarHeaderProps) {
  return (
    <div
      className={classNames(
        'flex items-center w-full relative my-1',
        !expanded ? 'flex-col items-start gap-2' : 'justify-between'
      )}
    >
      <div
        className={classNames(
          'font-bold text-2xl order-1',
          !expanded &&
            'relative order-2 top-10 text-lg [writing-mode:vertical-lr] transform -scale-100'
        )}
      >
        {title({ expanded })}
      </div>
      <Button
        type="text"
        onClick={toggleExpand}
        className={classNames(
          'bg-transparent border-none order-2 z-20',
          !expanded && 'order-1 absolute top-0'
        )}
        icon={
          expanded ? (
            <MinusOutlined className="text-white text-sm" />
          ) : (
            <PlusOutlined className="text-white text-sm w-[14px] h-[14px]" />
          )
        }
      />
    </div>
  );
}

export default function ApplicationSidebar({
  title,
  control,
  account = DefaultAccountPanel,
  navigation = AppNavigation,
}: ApplicationSidebarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [expanded, toggleExpand] = useReducer((val: boolean) => !val, false);

  useOnClickOutside(
    ref,
    () => {
      if (expanded) toggleExpand();
    },
    ['mousedown', 'touchstart'],
    (event) => {
      return event && (event.target as HTMLElement)?.closest('.ant-modal-root');
    }
  );

  return (
    <div
      ref={ref}
      className={classNames(
        'h-screen transition-transform ease-in-out bg-primary-9 text-light',
        pathname?.includes('/explore/literature') ? 'fixed top-0 z-50' : 'relative',
        expanded
          ? 'px-5 w-80 flex flex-col items-start justify-start shadow-[0px_5px_15px_rgba(0,0,0,.35)]'
          : 'w-10 flex flex-col items-center justify-between transition-transform ease-in-out will-change-auto'
      )}
    >
      <ApplicationSidebarHeader {...{ title, expanded, toggleExpand }} />
      <div className="w-full h-[calc(100%-410px)] overflow-y-auto primary-scrollbar flex items-start justify-start gap-y-1 flex-col">
        {control({ expanded })}
      </div>
      {(account || navigation) && (
        <div className="mb-4 w-[calc(100%-2.5rem)] bg-primary-9 z-20 mt-auto flex flex-col items-center justify-center absolute bottom-0">
          {account?.({ expanded })}
          {navigation?.({ expanded })}
        </div>
      )}
    </div>
  );
}
