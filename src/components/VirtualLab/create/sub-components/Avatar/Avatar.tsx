import { classNames } from '@/util/utils';

import styles from './avatar.module.css';

export interface AvatarProps {
  className?: string;
  email: string;
}

/**
 * This component uses a simple hash function based on two prime seeds
 * to map an email onto a pair of vivid colors.
 */
export function Avatar({ className, email }: AvatarProps) {
  const initials = getInitials(email);
  return (
    <div
      className={classNames(styles.main, className)}
      style={{
        background: getColor(email, 25, SEED_COLOR),
      }}
    >
      {initials}
    </div>
  );
}

const SEED_COLOR = 2711;

function getInitials(email: string): string {
  const [name] = email.split('@');
  const initials = name
    // Split on every non-letter (Unicode wise).
    .split(/[^\p{L}]+/u)
    .slice(0, 3)
    .map((word) => word.charAt(0).toLocaleUpperCase())
    .join('');
  return initials;
}

function getColor(email: string, luminance: number, step: number): string {
  const hue = getHue(email, step);
  return `hsl(${hue}deg 100% ${luminance}%)`;
}

function getHue(email: string, step: number): number {
  let total = 0;
  let index = step;
  const len = email.length;
  for (let loop = 1; loop < 64; loop += 1) {
    const cursor = index % len;
    index += step;
    const val = email.charCodeAt(cursor) * loop - 1;
    total += val;
  }
  return total % 360;
}
