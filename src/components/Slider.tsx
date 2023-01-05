import { KeyboardEventHandler, MouseEventHandler } from 'react';
import { InputNumber, Slider } from 'antd';
import { ArrowRightIcon, EyeIcon, LockIcon, LockOpenIcon } from '@/components/icons';
import IconButton from '@/components/IconButton';
import { classNames } from '@/util/utils';

interface HorizontalSliderProps {
  color: string;
  disabled?: boolean;
  label: string;
  max: number;
  onChange?: ((value: number | null) => void) | undefined;
  onToggleLock?: MouseEventHandler;
  value?: number;
}

interface VerticalSliderProps {
  color: string;
  className: string;
  isActive: boolean;
  disabled?: boolean;
  label: string;
  max: number;
  onChange?: ((value: number | null) => void) | undefined;
  onToggleLock?: MouseEventHandler;
  onClick?: MouseEventHandler<HTMLDivElement> | KeyboardEventHandler<HTMLDivElement>;
  value?: number;
}

export function HorizontalSlider({
  color,
  disabled = false,
  label,
  max,
  onChange,
  onToggleLock,
  value,
}: HorizontalSliderProps) {
  const lockIcon = disabled ? <LockIcon /> : <LockOpenIcon />;

  return (
    <div className="flex justify-between">
      <div className="flex gap-2 grow-0 items-center w-64">
        <ArrowRightIcon />
        <span className="font-bold text-primary-7">{label}</span>
        <IconButton onClick={onToggleLock}>{lockIcon}</IconButton>
      </div>

      <div className="flex grow items-center w-full">
        <InputNumber
          className="border border-neutral-3 rounded-none shadow-none text-right"
          onChange={onChange}
          inputMode="decimal"
          value={value}
        />
        <Slider
          className="grow"
          disabled={disabled}
          tooltip={{ open: false }}
          min={0}
          max={max}
          value={value}
          onChange={onChange}
          range={false}
          trackStyle={{ backgroundColor: color, width: '100%' }}
        />
      </div>
    </div>
  );
}

export function VerticalSlider({
  color,
  className,
  isActive,
  disabled = false,
  label,
  max,
  onChange,
  onClick,
  onToggleLock,
  value,
}: VerticalSliderProps) {
  const lockIcon = disabled ? <LockIcon /> : <LockOpenIcon />;

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={onClick as KeyboardEventHandler<HTMLDivElement>}
      className={classNames(className, isActive && 'bg-neutral-1')}
      onClick={onClick as MouseEventHandler<HTMLDivElement>}
    >
      <div className="flex gap-2">
        <div className="font-bold whitespace-nowrap">{label}</div>
        <IconButton onClick={onToggleLock}>{lockIcon}</IconButton>
        <IconButton>
          <EyeIcon />
        </IconButton>
      </div>

      <div className="flex h-2" style={{ backgroundColor: color }} />

      <InputNumber
        className="border border-neutral-3 rounded-none shadow-none w-full"
        onChange={onChange}
        inputMode="decimal"
        value={value}
      />

      <Slider
        className="self-center"
        vertical
        disabled={disabled}
        tooltip={{ open: false }}
        min={0}
        max={max}
        value={value}
        onChange={onChange}
        handleStyle={{ backgroundColor: color, boxShadow: color }}
        trackStyle={{ backgroundColor: color }}
      />
    </div>
  );
}
