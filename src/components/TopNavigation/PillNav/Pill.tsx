'use client';

import { useMemo } from 'react';
import { useAtomValue } from 'jotai';

import { themeAtom } from '@/state/theme';
import Link from '@/components/Link';

interface PillProps {
  label: string;
  isActive: boolean;
  href?: string;
  onClick?: () => void;
}

const LIGHT_CLASSES = 'text-primary-9';
const LIGHT_ACTIVE_CLASSES = 'font-bold bg-primary-9 text-white';
const DARK_CLASSES = 'text-neutral-3';
const DARK_ACTIVE_CLASSES = 'font-bold text-black bg-white';

export default function Pill({ label, isActive, href, onClick }: PillProps) {
  const theme = useAtomValue(themeAtom);
  const isLightThemeActive = theme === 'light';

  const pillClasses = useMemo(() => {
    if (isLightThemeActive) {
      return isActive ? LIGHT_ACTIVE_CLASSES : LIGHT_CLASSES;
    }
    return isActive ? DARK_ACTIVE_CLASSES : DARK_CLASSES;
  }, [isActive, isLightThemeActive]);

  const buttonEl = (
    <button
      type="button"
      className={`p-0 m-0 rounded-full flex flex-row items-center px-6 ${pillClasses}`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  return href ? (
    <Link className="flex" href={href} preserveLocationSearchParams>
      {buttonEl}
    </Link>
  ) : (
    buttonEl
  );
}
