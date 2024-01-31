import { classNames } from '@/util/utils';
import styles from './icon.module.css';

const ICONS = {
  'turn-left':
    'M20 13.5V20H18V13.5C18 11 16 9 13.5 9H7.83L10.91 12.09L9.5 13.5L4 8L9.5 2.5L10.92 3.91L7.83 7H13.5C17.09 7 20 9.91 20 13.5Z',
  'turn-right':
    'M20 8L14.5 13.5L13.09 12.09L16.17 9H10.5C8 9 6 11 6 13.5V20H4V13.5C4 9.91 6.91 7 10.5 7H16.17L13.08 3.91L14.5 2.5L20 8Z',
};

export interface IconProps {
  className?: string;
  name: keyof typeof ICONS;
  onClick(): void;
}

export default function Icon({ className, name, onClick }: IconProps) {
  const path = ICONS[name];
  const handleKeyDown = (evt: React.KeyboardEvent<HTMLSpanElement>) => {
    if (evt.key === ' ') onClick();
  };
  return (
    <span
      className={classNames(styles.Icon, className)}
      tabIndex={0}
      role="button"
      onPointerDown={onClick}
      onKeyDown={handleKeyDown}
    >
      <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" aria-label={name}>
        <path fill="currentColor" d={path} />
      </svg>
    </span>
  );
}
