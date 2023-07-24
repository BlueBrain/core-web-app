import { useEffect } from 'react';
import { useSetAtom } from 'jotai';

import usePathname from '@/hooks/pathname';
import { themeAtom } from '@/state/theme';
import { checkMatchPatterns } from '@/util/pattern-matching';

const DARK_THEME_PATH_PATTERNS = [
  /^\/build\/cell-composition\/interactive/,
  /^\/build\/connectome-definition/,
  /^\/build\/connectome-model-assignment\/configuration/,
];

export default function useTheme() {
  const pathname = usePathname();

  const setTheme = useSetAtom(themeAtom);

  useEffect(() => {
    if (!pathname) return;
    const activateDark = checkMatchPatterns(pathname, DARK_THEME_PATH_PATTERNS);
    setTheme(activateDark ? 'dark' : 'light');
  }, [setTheme, pathname]);
}
