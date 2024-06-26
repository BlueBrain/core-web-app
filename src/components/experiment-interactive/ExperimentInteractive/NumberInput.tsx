import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import isNumber from 'lodash/isNumber';
import toNumber from 'lodash/toNumber';

import { classNames } from '@/util/utils';

interface NumberInputProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  size?: number;
  onChange?: (newValue: number) => void;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}
export default function NumberInput({
  min,
  max,
  unit,
  size,
  value,
  step,
  onChange,
  className,
  onFocus,
  onBlur,
}: NumberInputProps) {
  const [localValue, setLocalValue] = useState<number | string>(value);

  const acceptValueChange = useCallback(() => {
    let localValueAsNumber = toNumber(localValue);

    // Ensure it's within the limits
    if (typeof min !== 'undefined' && localValueAsNumber < min) {
      localValueAsNumber = min;
      setLocalValue(localValueAsNumber);
    }
    if (typeof max !== 'undefined' && localValueAsNumber > max) {
      localValueAsNumber = max;
      setLocalValue(localValueAsNumber);
    }

    onChange?.(localValueAsNumber);
  }, [localValue, max, min, onChange]);

  const handleBlur = useCallback(() => {
    onBlur?.();
    acceptValueChange();
  }, [acceptValueChange, onBlur]);

  const handleChange = useCallback((event: ChangeEvent) => {
    setLocalValue((event.target as HTMLInputElement).value);
  }, []);

  useEffect(() => {
    if (isNumber(value)) {
      setLocalValue(value);
    }
  }, [value]);

  return (
    <div
      className={classNames(
        'flex inline-flex flex-row gap-2 border border-white/20 px-1 text-white/50',
        className
      )}
    >
      <input
        type="number"
        className="border-none bg-transparent text-right text-white"
        step={step ?? 0.01}
        value={localValue}
        size={size ?? 3}
        max={max}
        min={min}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={handleBlur}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && onChange) {
            acceptValueChange();
          }
        }}
        disabled={!onChange}
      />
      {unit}
    </div>
  );
}
