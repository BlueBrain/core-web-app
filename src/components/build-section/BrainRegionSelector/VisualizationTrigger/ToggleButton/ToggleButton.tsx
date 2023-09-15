import React from 'react';
import { classNames } from '@/util/utils';
import styles from './toggle-button.module.css';

export interface ToggleButtonProps {
  /** Is this region selected? */
  selected: boolean;
  /** Is this region busy loading some data? */
  busy: boolean;
  onClick(): void;
  /** The icon to display when not busy. */
  children: JSX.Element;
}

export default function ToggleButton({ selected, busy, onClick, children }: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(styles.ToggleButton, selected ? styles.selected : styles.unselected)}
    >
      {busy ? (
        <svg className={styles.spin} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
        </svg>
      ) : (
        children
      )}
    </button>
  );
}
