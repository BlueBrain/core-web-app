import { ReactNode, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAtomValue } from 'jotai';

import { themeAtom } from '@/state/theme';
import { navigateToHref } from '@/components/TopNavigation/utils';

interface SecondaryDropdownItemProps {
  label: string;
  href?: string;
  isActive?: boolean;
  icon?: ReactNode;
}

const LIGHT_CLASSES = 'text-primary-9 hover:bg-neutral-1';
const LIGHT_ACTIVE_CLASSES = 'text-white bg-primary-9 hover:bg-primary-8';
const DARK_CLASSES = 'text-white bg-black hover:bg-neutral-6';
const DARK_ACTIVE_CLASSES = 'text-black bg-white hover:bg-neutral-1';

export default function SecondaryDropdownItem({
  label,
  href,
  icon,
  isActive,
}: SecondaryDropdownItemProps) {
  const router = useRouter();
  const theme = useAtomValue(themeAtom);
  const isLightThemeActive = theme === 'light';

  const buttonClasses = useMemo(() => {
    if (isLightThemeActive) {
      return isActive ? LIGHT_ACTIVE_CLASSES : LIGHT_CLASSES;
    }
    return isActive ? DARK_ACTIVE_CLASSES : DARK_CLASSES;
  }, [isActive, isLightThemeActive]);

  const handleClick = useCallback(() => {
    if (href) {
      navigateToHref({ router, url: href });
    }
  }, [href, router]);

  return (
    <DropdownMenu.Item key={label} asChild>
      <button
        type="button"
        className={`flex flex-row p-3 gap-3 items-center font-bold outline-none ${buttonClasses}`}
        onClick={handleClick}
      >
        {icon}
        {label}
      </button>
    </DropdownMenu.Item>
  );
}
