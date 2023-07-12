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
          className={`min-w-[190px] h-full border-l ${
            isLightThemeActive ? `border-neutral-2` : `border-neutral-6`
          }`}
        >
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className={`flex flex-row gap-2 min-w-[190px] h-full items-center justify-center px-10 font-bold outline-none ${
              isLightThemeActive ? `text-primary-9 bg-white` : `bg-black text-white`
            }`}
          >
            {activeItem?.icon}
            {activeItem?.label}
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="bg-white border-none rounded-none min-w-[190px] flex flex-col relative z-50">
            {menuItems}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    ),
    [activeItem?.icon, activeItem?.label, isLightThemeActive, menuItems]
  );

  return secondaryDropdown !== null ? createPortal(component, secondaryDropdown) : null;
}
