/* eslint-disable jsx-a11y/label-has-associated-control */
import { CSSProperties } from 'react';

import { classNames } from '@/util/utils';

import styles from './checkbox.module.scss';

type CheckboxProps = {
  id?: string;
  bgColor?: string;
  checked: boolean;
  title?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  size?: string;
};

export default function CheckBox({
  id,
  onChange,
  checked,
  bgColor,
  title,
  size = '18px',
}: CheckboxProps) {
  return (
    <div className="checkbox-container flex">
      <input
        onChange={onChange}
        id={id}
        type="checkbox"
        checked={checked}
        className={classNames(
          styles.checkbox,
          'relative m-0 inline-block cursor-pointer rounded border border-solid align-top',
          'transition-all duration-300'
        )}
        style={
          {
            width: size,
            height: size,
            '--color': bgColor,
          } as CSSProperties
        }
      />
      {title && (
        <label htmlFor={id} className="ml-1 inline-block cursor-pointer align-middle text-base">
          {title}
        </label>
      )}
    </div>
  );
}
