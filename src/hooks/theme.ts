import { useEffect } from 'react';
import { useSetAtom } from 'jotai';

import usePathname from '@/hooks/pathname';
import { themeAtom } from '@/state/theme';

const DARK_THEME_PATHNAMES = ['/brain-factory/cell-composition/interactive'];

export default function useTheme() {
  const pathname = usePathname();

  const setTheme = useSetAtom(themeAtom);

  useEffect(() => {
    if (!pathname) return;

    setTheme(DARK_THEME_PATHNAMES.includes(pathname) ? 'dark' : 'light');
  }, [setTheme, pathname]);
}
