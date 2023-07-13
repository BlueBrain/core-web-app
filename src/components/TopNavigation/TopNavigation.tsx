import { ReactNode, useEffect, useRef } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import { themeAtom } from '@/state/theme';
import {
  pillNavigationAtom,
  primaryDropdownAtom,
  secondaryDropdownAtom,
} from '@/components/TopNavigation/atoms';

interface TopNavigationProps {
  children: ReactNode;
}

export default function TopNavigation({ children }: TopNavigationProps) {
  const theme = useAtomValue(themeAtom);
  const isLightThemeActive = theme === 'light';

  const primaryDropdownRef = useRef<HTMLDivElement>(null);
  const pillNavigationRef = useRef<HTMLDivElement>(null);
  const secondaryDropdownRef = useRef<HTMLDivElement>(null);

  const setPrimaryDropdown = useSetAtom(primaryDropdownAtom);
  const setPillNavigation = useSetAtom(pillNavigationAtom);
  const setSecondaryDropdown = useSetAtom(secondaryDropdownAtom);

  useEffect(() => {
    setPrimaryDropdown(primaryDropdownRef.current);
  }, [setPrimaryDropdown]);

  useEffect(() => {
    setPillNavigation(pillNavigationRef.current);
  }, [setPillNavigation]);

  useEffect(() => {
    setSecondaryDropdown(secondaryDropdownRef.current);
  }, [setSecondaryDropdown]);

  return (
    <div
      className={`flex flex-row w-full h-[40px] relative z-50 border-b ${
        isLightThemeActive ? `bg-white border-b-neutral-2` : `bg-black border-b-neutral-6`
      }`}
    >
      <div className="flex min-w-[290px] h-full" ref={primaryDropdownRef} />
      <div className="flex flex-grow" ref={pillNavigationRef} />
      <div className="flex justify-end min-w-[290px] h-full" ref={secondaryDropdownRef} />
      {children}
    </div>
  );
}
