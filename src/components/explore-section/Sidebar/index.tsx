import { useReducer } from 'react';
import { Button } from 'antd';
import { useAtomValue } from 'jotai';
import Icon, {
  PlusOutlined,
  UserOutlined,
  HomeOutlined,
  MinusOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';

import { EyeIcon } from '@/components/icons';
import { backToListPathAtom } from '@/state/explore-section/detail-view-atoms';
import { sectionContent } from '@/constants/home-sections/homeSectionContent';
import { SingleCard } from '@/types/explore-section/application';
import { classNames } from '@/util/utils';
import usePathname from '@/hooks/pathname';
import Link from '@/components/Link';

type NavTailItemProps = {
  url: string;
  title: string;
  expandedMenu: boolean;
  icon: React.ForwardRefExoticComponent<any>;
  background?: string;
  showIconOnCollapse?: boolean;
  hasDivider?: boolean;
};

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

const tailNavItems: Array<Omit<NavTailItemProps, 'expandedMenu'>> = [
  {
    title: 'Home',
    url: '/',
    icon: HomeOutlined,
    showIconOnCollapse: true,
    hasDivider: true,
  },
  {
    title: 'User',
    url: '/',
    icon: UserOutlined,
    showIconOnCollapse: true,
  },
  {
    url: '/build/load-brain-config',
    title: 'Build',
    icon: ArrowRightOutlined,
    background: 'bg-primary-8',
  },
  {
    url: '/simulate',
    title: 'Simulate',
    icon: ArrowRightOutlined,
    background: 'bg-primary-8',
  },
];

function NavTailItem({
  url,
  title,
  icon,
  expandedMenu,
  background,
  showIconOnCollapse,
  hasDivider,
}: NavTailItemProps) {
  return (
    <>
      <li
        className={classNames(
          'mx-auto p-2 relative right-0 w-full block ease-in-out hover:bg-primary-7',
          'transition-opacity ease-in-out duration-100',
          background ?? 'bg-transparent',
          !showIconOnCollapse && !expandedMenu ? 'h-0 w-0 opacity-0' : 'opacity-100'
        )}
      >
        <Link
          href={url}
          className={classNames(
            'w-full inline-flex items-center  gap-2 transition-transform ease-in-out font-bold',
            expandedMenu ? 'justify-between' : 'justify-center'
          )}
        >
          <h2 className={expandedMenu ? 'block' : 'hidden'}>{title}</h2>
          <Icon component={icon} className={expandedMenu ? 'text-white' : 'text-primary-4'} />
        </Link>
      </li>
      {expandedMenu && hasDivider && <div className="w-[96%] px-2 bg-primary-7 h-px mx-auto" />}
    </>
  );
}

function ObservationNavItem({ url, name, description }: SingleCard) {
  const pathname = usePathname();
  return (
    <li
      key={url}
      className={classNames(
        'h-1/4 flex mx-auto p-4 cursor-pointer relative w-full  hover:bg-primary-7',
        pathname?.startsWith(url) ? 'bg-primary-7' : 'bg-primary-8'
      )}
    >
      <Link href={url} className="w-full mx-auto">
        <h1 className="text-xl font-bold">{name}</h1>
        <span className="h-7 w-6 flex items-center justify-center mx-auto w-ful absolute top-4 right-4">
          <EyeIcon className="text-white h-6" />
        </span>
        <p className="select-none mt-4 text-justify font-thin text-sm line-clamp-2 text-primary-4">
          {description}
        </p>
      </Link>
    </li>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, toggleExpand] = useReducer((val: boolean) => !val, false);

  return (
    <div
      className={classNames(
        'h-screen transition-transform ease-in-out bg-primary-9 text-light',
        pathname?.includes('/explore/literature') && 'fixed top-0 z-50',
        expanded
          ? 'px-3 w-80 flex flex-col items-start justify-between shadow-[0px_5px_15px_rgba(0,0,0,.35)]'
          : 'w-10 flex flex-col items-center justify-between transition-transform ease-in-out will-change-auto'
      )}
    >
      <div
        className={classNames(
          'flex items-center justify-between w-full relative my-2',
          !expanded && 'flex-col justify-between items-start'
        )}
      >
        <Link
          href="/explore"
          className={classNames(
            'font-bold text-2xl order-1 transition-transform duration-150 ease-in-out',
            !expanded && 'relative top-20 -rotate-90 origin-center order-2 text-lg'
          )}
        >
          Explore
        </Link>
        <Button
          type="text"
          onClick={toggleExpand}
          className={classNames(
            'mt-4 bg-transparent border-none order-2',
            !expanded && 'order-1 absolute top-0'
          )}
          icon={
            expanded ? (
              <MinusOutlined className="text-white" />
            ) : (
              <PlusOutlined className="text-white" />
            )
          }
        />
      </div>

      {expanded && (
        <ul className="my-5 w-full h-full flex items-start justify-start gap-y-1 flex-col">
          {sectionContent.map((item) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <ObservationNavItem key={item.url} {...{ ...item }} />
          ))}
        </ul>
      )}
      <ul
        className={classNames(
          'mb-4 w-full flex items-center gap-y-2',
          expanded ? 'flex-col' : 'flex-col-reverse gap-y-0'
        )}
      >
        {tailNavItems.map((item) => (
          <NavTailItem
            key={`${item.url}-${item.title}`}
            expandedMenu={expanded}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...{ ...item }}
          />
        ))}
      </ul>
    </div>
  );
}
