import { ReactNode } from 'react';
import { classNames } from '@/util/utils';

import styles from './warning.module.css';

export interface WarningProps {
  className?: string;
  visible: boolean;
  onClose(): void;
  children: ReactNode;
}

export function Warning({ className, visible, onClose: onClick, children }: WarningProps) {
  return (
    <button
      className={classNames(styles.main, className, visible ? styles.show : styles.hide)}
      onClick={onClick}
      onWheel={onClick}
      onKeyDown={onClick}
      type="button"
    >
      <div>{children}</div>
    </button>
  );
}
