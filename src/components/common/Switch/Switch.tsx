import { ReactNode, useId } from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';

import { classNames } from '@/util/utils';

import styles from './switch.module.css';

export interface SwitchProps {
  className?: string;
  value: boolean;
  onChange(value: boolean): void;
  /**
   * What to display as a label.
   */
  children?: ReactNode;
  /**
   * In `darkMode`, we will invert the colors.
   */
  darkMode?: boolean;
  /**
   * Color of the switch background and of the label (in light mode).
   */
  mainColor?: string;
  /**
   * Color of the thumb (in light mode).
   */
  thumbColor?: string;
}

export function Switch({
  className,
  value,
  onChange,
  children,
  darkMode = false,
  mainColor = '#003a8c',
  thumbColor = '#fff',
}: SwitchProps) {
  const id = useId();
  return (
    <div
      className={classNames(styles.main, className)}
      style={{
        '--custom-color-main': darkMode ? thumbColor : mainColor,
        '--custom-color-thumb': darkMode ? mainColor : thumbColor,
      }}
    >
      <label htmlFor={id}>{children}</label>
      <RadixSwitch.Root
        id={id}
        className={styles.SwitchRoot}
        checked={value}
        onCheckedChange={onChange}
      >
        <RadixSwitch.Thumb className={styles.SwitchThumb} />
      </RadixSwitch.Root>
    </div>
  );
}
