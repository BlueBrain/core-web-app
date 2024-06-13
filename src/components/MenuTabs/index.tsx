import { HTMLProps } from 'react';
import { classNames as clsx } from '@/util/utils';

type TabProps = {
  id: string;
  label: string;
  active: boolean;
  onClick: (id: string) => void;
  className?: HTMLProps<HTMLButtonElement>['className'];
  activeClassName?: HTMLProps<HTMLButtonElement>['className'];
};

export type MenuTabItem = {
  id: string;
  label: string;
};

function Tab({ id, label, active, className, activeClassName, onClick }: TabProps) {
  return (
    <li className="me-2">
      <button
        type="button"
        onClick={() => onClick(id)}
        className={clsx(
          'group relative inline-block px-4 pb-2 pt-4 text-base',
          'hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300',
          className,
          active ? clsx('font-bold', activeClassName) : 'font-light'
        )}
        role="tab"
      >
        {label}
        <span
          className={clsx(
            'absolute bottom-0 left-1/2 h-[2px] w-1/3 -translate-x-1/2 rounded-full bg-white',
            'transition-opacity duration-200 ease-linear',
            active ? 'opacity-100' : 'opacity-0'
          )}
        />
      </button>
    </li>
  );
}

export default function MenuTabs({
  activeKey,
  items,
  onTabClick,
  classNames,
}: {
  activeKey: string;
  items: Array<MenuTabItem>;
  onTabClick: (id: string) => void;
  classNames?: {
    containerName?: HTMLProps<HTMLDivElement>['className'];
    tabItemClassName?: HTMLProps<HTMLButtonElement>['className'];
    activeClassName?: HTMLProps<HTMLButtonElement>['className'];
  };
}) {
  return (
    <div
      className={clsx(
        'text-center text-sm font-medium text-white dark:border-gray-700 dark:text-gray-400',
        classNames?.containerName
      )}
    >
      <ul className="-mb-px flex flex-nowrap">
        {items.map(({ id, label }) => (
          <Tab
            key={`data-tab-${id}`}
            {...{
              id,
              label,
              onClick: onTabClick,
              active: activeKey === id,
              className: classNames?.tabItemClassName,
              activeClassName: classNames?.activeClassName,
            }}
          />
        ))}
      </ul>
    </div>
  );
}
