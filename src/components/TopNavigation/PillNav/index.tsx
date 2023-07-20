import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { createPortal } from 'react-dom';

import Pill from './Pill';
import { themeAtom } from '@/state/theme';
import { MenuItem } from '@/components/TopNavigation/types';
import { pillNavigationAtom } from '@/components/TopNavigation/atoms';

interface PillNavProps {
  items: MenuItem[];
  activeItemIndex: number;
  onChange?: (itemIndex: number) => void;
}

export default function PillNav({ items, onChange, activeItemIndex = -1 }: PillNavProps) {
  const pillNavigation = useAtomValue(pillNavigationAtom);
  const theme = useAtomValue(themeAtom);
  const isLightThemeActive = theme === 'light';

  const pillItems = useMemo(
    () =>
      items.map((pill, index) => (
        <Pill
          key={pill.id}
          label={pill.label}
          href={pill.href}
          isActive={(pill.isActive ?? false) || index === activeItemIndex}
          onClick={() => onChange?.(index)}
        />
      )),
    [activeItemIndex, items, onChange]
  );

  const component = (
    <div
      className={`mx-3 my-1.5 rounded-full flex flex-row ${
        isLightThemeActive ? `bg-neutral-1` : `bg-neutral-5 text-neutral-4`
      }`}
    >
      {pillItems}
    </div>
  );

  return pillNavigation !== null ? createPortal(component, pillNavigation) : null;
}
