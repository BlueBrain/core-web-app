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
        <DropdownMenu.Trigger asChild className="min-w-[287px] h-full">
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className={`flex flex-row gap-2 w-full h-full items-center justify-between px-5 font-bold border-transparent outline-none ${
              isLightThemeActive ? `text-white bg-primary-9` : `text-black bg-white`
            }`}
          >
            <div className="flex flex-row gap-x-3">
              <div
                className={`flex flex-row gap-x-2 font-bold items-center ${
                  isLightThemeActive ? `text-primary-5` : `text-neutral-3`
                }`}
              >
                <div className={isLightThemeActive ? `text-white` : `text-black`}>
                  {activeItemIndex + 1}
                </div>
                <div
                  className={`rotate-[48deg] w-[1px] h-[12px] ${
                    isLightThemeActive ? `bg-primary-5` : `bg-neutral-3`
                  } `}
                />
                <div>{items.length}</div>
              </div>
              <div className="font-bold">{activeItem.label}</div>
            </div>
            <ChevronDownIcon className="scale-[200%] origin-center" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className={`border-none rounded-none min-w-[287px] flex flex-col relative z-50 ${
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
