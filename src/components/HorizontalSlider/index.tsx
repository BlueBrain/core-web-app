import { useCallback, useEffect, useState } from 'react';
import { Slider } from 'antd';
import round from '@/services/distribution-sliders/round';

interface HorizontalSliderProps {
  color: string;
  disabled?: boolean;
  max: number;
  step: number;
  onChange?: ((value: number | null) => void) | undefined;
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

export default function HorizontalSlider({
  color,
  disabled = false,
  max,
  onChange,
  value,
  step,
}: HorizontalSliderProps) {
  const { sliderValue, onSliderChange, onAfterChange } = useDeferredSlider(value, step, onChange);

  return (
    <div className="flex justify-between">
      <div className="flex grow items-center w-full">
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
