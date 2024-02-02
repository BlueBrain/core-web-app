import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import findIndex from 'lodash/findIndex';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAtomValue } from 'jotai';

import PrimaryDropdownItem from './PrimaryDropdownItem';
import usePathname from '@/hooks/pathname';
import { MenuItem } from '@/components/TopNavigation/types';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon';
import { themeAtom } from '@/state/theme';
import { primaryDropdownAtom } from '@/components/TopNavigation/atoms';

interface PrimaryDropdownProps {
  activeItem?: MenuItem;
  items: MenuItem[];
}

export default function PrimaryDropdown({
  items,
  activeItem: userActiveItem,
}: PrimaryDropdownProps) {
  const primaryDropdown = useAtomValue(primaryDropdownAtom);
  const theme = useAtomValue(themeAtom);
  const isLightThemeActive = theme === 'light';
  const pathname = usePathname();

  const activeItemIndex = useMemo(() => {
    const index = findIndex(items, (item) =>
      pathname && item.baseHref ? pathname.startsWith(item.baseHref) : false
    );
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
          <PrimaryDropdownItem
            label={item.label}
            annotation={item.annotation}
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
        <DropdownMenu.Trigger asChild className="h-full min-w-[287px]">
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className={`flex h-full w-full flex-row items-center justify-between gap-2 border-transparent px-5 font-bold outline-none ${
              isLightThemeActive ? `bg-primary-9 text-white` : `bg-white text-black`
            }`}
          >
            <div className="flex flex-row gap-x-3">
              <div
                className={`flex flex-row items-center gap-x-2 font-bold ${
                  isLightThemeActive ? `text-primary-5` : `text-neutral-3`
                }`}
              >
                <div className={isLightThemeActive ? `text-white` : `text-black`}>
                  {activeItemIndex + 1}
                </div>
                <div
                  className={`h-[12px] w-[1px] rotate-[48deg] ${
                    isLightThemeActive ? `bg-primary-5` : `bg-neutral-3`
                  } `}
                />
                <div>{items.length}</div>
              </div>
              <div className="font-bold">{activeItem.label}</div>
            </div>
            <ChevronDownIcon className="origin-center scale-[200%]" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className={`relative z-50 flex min-w-[287px] flex-col rounded-none border-none ${
              isLightThemeActive ? `bg-primary-9 text-white` : `bg-white text-black`
            }`}
          >
            {menuItems}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    ),
    [activeItem.label, activeItemIndex, isLightThemeActive, items.length, menuItems]
  );

  return primaryDropdown !== null ? createPortal(component, primaryDropdown) : null;
}
