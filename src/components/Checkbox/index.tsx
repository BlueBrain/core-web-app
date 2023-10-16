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
};

export default function CheckBox({ id, onChange, checked, bgColor, title }: CheckboxProps) {
  return (
    <div className="checkbox-container">
      <input
        onChange={onChange}
        id={id}
        type="checkbox"
        checked={checked}
        className={classNames(
          styles.checkbox,
          'h-[18px] w-[18px] inline-block align-top relative cursor-pointer border rounded m-0 border-solid',
          'transition-all duration-300'
        )}
        style={
          {
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
