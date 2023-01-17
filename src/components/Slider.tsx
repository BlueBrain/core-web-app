import { KeyboardEventHandler, MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { InputNumber, Slider } from 'antd';
import { ArrowRightIcon, EyeIcon, LockIcon, LockOpenIcon } from '@/components/icons';
import IconButton from '@/components/IconButton';
import { classNames } from '@/util/utils';
import round from '@/services/distribution-sliders/round';

interface HorizontalSliderProps {
  color: string;
  disabled?: boolean;
  label: string;
  max: number;
  step: number;
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
  step: number;
  onChange?: ((value: number | null) => void) | undefined;
  onToggleLock?: MouseEventHandler;
  onClick?: MouseEventHandler<HTMLDivElement> | KeyboardEventHandler<HTMLDivElement>;
  value?: number;
}

function useDeferredSlider(
  value: number | undefined,
  step: number,
  onChange?: ((value: number | null) => void) | undefined
) {
  const [sliderValue, setSliderValue] = useState(value);
  const [isSliderMoving, setIsSliderMoving] = useState(false);

  const onSliderChange = useCallback(
    (newValue: number) => {
      // eslint-disable-next-line no-bitwise
      setSliderValue(round(newValue, (Math.log(1 / step) * Math.LOG10E + 1) | 0));
      setIsSliderMoving(true);
    },
    [step]
  );

  const onAfterChange = useCallback(
    (newValue: number) => {
      if (onChange) {
        onChange(newValue);
      }
      setIsSliderMoving(false);
    },
    [onChange]
  );

  useEffect(() => {
    if (!isSliderMoving && sliderValue !== value) {
      setSliderValue(value);
    }
  }, [isSliderMoving, sliderValue, value]);

  return { sliderValue, isSliderMoving, onSliderChange, onAfterChange };
}

export function HorizontalSlider({
  color,
  disabled = false,
  label,
  max,
  onChange,
  onToggleLock,
  value,
  step,
}: HorizontalSliderProps) {
  const lockIcon = disabled ? <LockIcon /> : <LockOpenIcon />;

  const { sliderValue, isSliderMoving, onSliderChange, onAfterChange } = useDeferredSlider(
    value,
    step,
    onChange
  );

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
          value={isSliderMoving ? sliderValue : value}
        />
        <Slider
          className="grow"
          disabled={disabled}
          tooltip={{ open: false }}
          min={0}
          max={max}
          step={step}
          value={sliderValue}
          onChange={onSliderChange}
          onAfterChange={onAfterChange}
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
  step,
  onChange,
  onClick,
  onToggleLock,
  value,
}: VerticalSliderProps) {
  const lockIcon = disabled ? <LockIcon /> : <LockOpenIcon />;

  const { sliderValue, isSliderMoving, onSliderChange, onAfterChange } = useDeferredSlider(
    value,
    step,
    onChange
  );

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
        value={isSliderMoving ? sliderValue : value}
      />
      <Slider
        className="self-center"
        vertical
        disabled={disabled}
        tooltip={{ open: false }}
        min={0}
        max={max}
        step={step}
        value={sliderValue}
        onChange={onSliderChange}
        onAfterChange={onAfterChange}
        handleStyle={{ backgroundColor: color, boxShadow: color }}
        trackStyle={{ backgroundColor: color }}
      />
    </div>
  );
}
