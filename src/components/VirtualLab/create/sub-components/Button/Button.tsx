import { ReactNode } from 'react';
import Link from 'next/link';

import { classNames } from '@/util/utils';

import styles from './button.module.css';

export interface ButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'text' | 'primary';
  href?: string;
  onClick?(): void;
  children: ReactNode;
}

export function Button({
  className,
  href,
  onClick,
  children,
  disabled = false,
  variant = 'default',
}: ButtonProps) {
  const classes = classNames(
    className,
    styles.main,
    styles[`variant-${variant}`],
    disabled && styles.disabled
  );
  if (href)
    return (
      <Link className={classes} href={href} onClick={onClick}>
        {children}
      </Link>
    );

  return (
    <button className={classes} type="button" onClick={onClick}>
      {children}
    </button>
  );
}
