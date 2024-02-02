import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import findIndex from 'lodash/findIndex';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAtomValue } from 'jotai';

import SecondaryDropdownItem from './SecondaryDropdownItem';
import { MenuItem } from '@/components/TopNavigation/types';
import { themeAtom } from '@/state/theme';
import { secondaryDropdownAtom } from '@/components/TopNavigation/atoms';
import usePathname from '@/hooks/pathname';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon';

interface SecondaryDropdownProps {
  activeItem?: MenuItem;
  items: MenuItem[];
}

export default function SecondaryDropdown({
  items,
  activeItem: userActiveItem,
}: SecondaryDropdownProps) {
  const secondaryDropdown = useAtomValue(secondaryDropdownAtom);
  const theme = useAtomValue(themeAtom);
  const isLightThemeActive = theme === 'light';
  const pathname = usePathname();

  const activeItemIndex = useMemo(() => {
    const index = findIndex(items, (item) => {
      const hrefToCheck = item.baseHref ?? item.href;
      return pathname && hrefToCheck ? pathname.startsWith(hrefToCheck) : false;
    });
    if (index === -1) {
      return 0;
    }
    return index;
  }, [items, pathname]);

  const activeItem = useMemo(
    () => userActiveItem ?? items[activeItemIndex],
    [activeItemIndex, items, userActiveItem]
  );

  const menuItems = useMemo(
    () => (
      <>
        {items.map((item, index) => (
          <SecondaryDropdownItem
            label={item.label}
            icon={item.icon}
            href={item.href}
            key={item.label}
            isActive={index === activeItemIndex}
          />
        ))}
      </>
    ),
    [activeItemIndex, items]
  );

  const component = useMemo(
    () => (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          asChild
          className={`h-full min-w-[190px] border-l ${
            isLightThemeActive ? `border-neutral-2` : `border-neutral-6`
          }`}
        >
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className={`flex h-full min-w-[190px] flex-row items-center justify-between gap-2 px-5 font-bold outline-none ${
              isLightThemeActive ? `bg-white text-primary-9` : `bg-black text-white`
            }`}
          >
            <div className="flex flex-grow flex-row items-center justify-center gap-x-2">
              {activeItem?.icon}
              {activeItem?.label}
            </div>
            <ChevronDownIcon className="origin-center scale-[200%]" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="relative z-50 flex min-w-[190px] flex-col rounded-none border-none bg-white">
            {menuItems}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    ),
    [activeItem?.icon, activeItem?.label, isLightThemeActive, menuItems]
  );

  return secondaryDropdown !== null ? createPortal(component, secondaryDropdown) : null;
}
