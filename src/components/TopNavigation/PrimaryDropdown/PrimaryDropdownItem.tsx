import { ReactNode, useCallback, useMemo } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai';

import { PrimaryDropdownAnnotation } from '@/components/TopNavigation/types';
import { SettingsIcon } from '@/components/icons';
import { navigateToHref } from '@/components/TopNavigation/utils';
import { themeAtom } from '@/state/theme';

interface PrimaryDropdownItemProps {
  label: string;
  annotation?: PrimaryDropdownAnnotation;
  href?: string;
  isActive?: boolean;
}

interface ItemAnnotation {
  label: string;
  icon: ReactNode;
  textColor: string;
}

const ANNOTATION_LABEL_MAP: Record<PrimaryDropdownAnnotation, ItemAnnotation> = {
  [PrimaryDropdownAnnotation.modified]: {
    icon: <SettingsIcon />,
    label: 'modified',
    textColor: 'text-orange-500',
  },
  [PrimaryDropdownAnnotation.needAction]: {
    icon: <SettingsIcon />,
    label: 'need action',
    textColor: 'text-error',
  },
  [PrimaryDropdownAnnotation.built]: {
    icon: <SettingsIcon />,
    label: 'built',
    textColor: 'text-green-500',
  },
};

const LIGHT_CLASSES = 'bg-primary-9 text-white font-light hover:bg-primary-8';
const LIGHT_ACTIVE_CLASSES = 'bg-white text-primary-9 font-bold hover:bg-neutral-1';
const DARK_CLASSES = 'bg-white text-black font-light hover:bg-neutral-1';
const DARK_ACTIVE_CLASSES = 'bg-black text-white font-bold hover:bg-neutral-6';

export default function PrimaryDropdownItem({
  label,
  annotation,
  isActive,
  href,
}: PrimaryDropdownItemProps) {
  const router = useRouter();
  const theme = useAtomValue(themeAtom);
  const isLightThemeActive = theme === 'light';

  const annotationComponent = useMemo(
    () =>
      typeof annotation !== 'undefined' ? (
        <div
          className={`flex flex-row gap-0.5 text-sm text-error font-light items-center ${ANNOTATION_LABEL_MAP[annotation].textColor}`}
        >
          <div className="scale-75">{ANNOTATION_LABEL_MAP[annotation].icon}</div>
          {ANNOTATION_LABEL_MAP[annotation].label}
        </div>
      ) : null,
    [annotation]
  );

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
    <DropdownMenu.Item asChild>
      <button
        type="button"
        className={`flex flex-row px-5 py-3 gap-3 text-left items-center outline-none ${buttonClasses}`}
        onClick={handleClick}
      >
        <div className="flex-1">{label}</div>
        {annotationComponent}
      </button>
    </DropdownMenu.Item>
  );
}
