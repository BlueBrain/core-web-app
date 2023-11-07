import { useState } from 'react';
import { Slider } from 'antd';
import type { SliderMarks } from 'antd/es/slider';

import { MEFeatureProps } from '@/types/me-model';

type Props = {
  featureInfo: MEFeatureProps;
  onChangeParam?: (newStart: number, newEnd: number) => void;
};

export default function RangeSlider({ featureInfo, onChangeParam }: Props) {
  const {
    range: [min, max],
    selectedRange: [start, end],
    step,
  } = featureInfo;

  const initialMarks: SliderMarks = {
    [min]: min,
    [max]: max,
    [start]: start,
    [end]: end,
  };
  const [marks, setMarks] = useState<SliderMarks>(initialMarks);

  const [[startValue, endValue], setStartEndValues] = useState<[number, number]>([start, end]);

  const onSliderChange = ([newStart, newEnd]: [number, number]) => {
    setMarks((oldAtomData) => ({
      ...oldAtomData,
      [newStart]: newStart,
      [newEnd]: newEnd,
    }));
    setStartEndValues([newStart, newEnd]);
    onChangeParam?.(newStart, newEnd);
  };

  return (
    <Slider
      range
      min={min}
      max={max}
      step={step}
      defaultValue={[startValue, endValue]}
      marks={marks}
      onChange={onSliderChange}
      tooltip={{ open: false }}
    />
  );
}
