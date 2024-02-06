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
   * We can add a label before the thumb for the False value.
   */
  labelForFalse?: string;
  /**
   * We can add a label after the thumb for the True value.
   */
  labelForTrue?: string;
  /**
   * Background color (when false).
   */
  background?: string;
  /**
   * Main color.
   */
  color?: string;
}

export function Switch({
  className,
  value,
  onChange,
  children,
  labelForFalse,
  labelForTrue,
  background = '#fff',
  color = '#003a8c',
}: SwitchProps) {
  const id = useId();
  return (
    <div
      className={classNames(styles.main, className)}
      style={{
        '--custom-switch-color-front': color,
        '--custom-switch-color-back': background,
      }}
      onDoubleClick={(evt) => {
        /**
         * If the user clicks twice on the Switch,
         * it can throw a DoubleClick event and we want
         * to swallow it because it could trigger unwanted
         * behaviour on the parent.
         * (for instance, in a 3D component that uses double-click
         * to toggle fullscreen mode).
         */
        evt.preventDefault();
        evt.stopPropagation();
      }}
    >
      {children && <label htmlFor={id}>{children}</label>}
      <div>
        {labelForFalse && <label htmlFor={id}>{labelForFalse}</label>}
        <RadixSwitch.Root
          id={id}
          className={styles.SwitchRoot}
          checked={value}
          onCheckedChange={onChange}
        >
          <RadixSwitch.Thumb className={styles.SwitchThumb} />
        </RadixSwitch.Root>
        {labelForTrue && <label htmlFor={id}>{labelForTrue}</label>}
      </div>
    </div>
  );
}
