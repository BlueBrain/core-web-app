import { useRef, ChangeEvent } from 'react';
import { TgdColor } from '@bbp/morphoviewer';
import { classNames } from '@/util/utils';
import { EyeIcon } from '@/components/icons';
import EyeSlashIcon from '@/components/icons/EyeSlashIcon';

import styles from './color-input.module.css';

export interface ColorInputProps {
  className?: string;
  label: string;
  canBeHidden: boolean;
  value: string;
  onChange(value: string): void;
}

export function ColorInput({ className, label, canBeHidden, value, onChange }: ColorInputProps) {
  const refInput = useRef<HTMLInputElement | null>(null);
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
    const input = evt.target;
    const color = input.value;
    onChange(setOpacity(color, canBeHidden ? isOpaque(value) : false));
  };
  const handleClick = () => {
    const input = refInput.current;
    if (!input) return;

    input.click();
  };
  const visible = isOpaque(value);
  return (
    <div className={classNames(styles.main, className)}>
      <input ref={refInput} type="color" value={value} onInput={handleChange} />
      <button onClick={handleClick} type="button">
        <div
          className={styles.color}
          style={{
            background: value,
          }}
        />
        <div>{label}</div>
      </button>
      {canBeHidden && (
        <button
          className={styles.eye}
          type="button"
          onClick={(evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            onChange(toggleOpacity(value));
          }}
          title={`Click to ${visible ? 'hide' : 'show'} ${label}`}
        >
          {visible ? <EyeIcon /> : <EyeSlashIcon />}
        </button>
      )}
    </div>
  );
}

const COLOR = new TgdColor();

function toggleOpacity(color: string): string {
  COLOR.parse(color);
  COLOR.A = COLOR.A < 1 ? 1 : 0.99;
  return COLOR.toString();
}

function isOpaque(color: string) {
  COLOR.parse(color);
  return COLOR.A >= 1;
}

function setOpacity(color: string, opaque: boolean): string {
  COLOR.parse(color);
  COLOR.A = opaque ? 1 : 0.99;
  return COLOR.toString();
}
