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
          'inline-block align-top relative cursor-pointer border rounded m-0 border-solid',
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
        <label htmlFor={id} className="inline-block ml-1 text-base align-middle cursor-pointer">
          {title}
        </label>
      )}
    </div>
  );
}
