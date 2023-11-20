'use client';

import { useCallback, useState } from 'react';
import { Slider, Collapse, CollapseProps } from 'antd';
import { ImportOutlined } from '@ant-design/icons';
import type { SliderMarks } from 'antd/es/slider';
import { PrimitiveAtom, useAtom } from 'jotai';
import round from 'lodash/round';

import Stepper from './Stepper';
import type { ExpDesignerRangeParameter, StepperType } from '@/types/experiment-designer';
import { classNames } from '@/util/utils';
import { calculateRangeOutput } from '@/components/experiment-designer/utils';

type Props = {
  paramAtom: PrimitiveAtom<ExpDesignerRangeParameter>;
  className?: string;
  onChangeParamType?: () => void;
};

type RangeLiveProps = {
  start: number;
  end: number;
  stepper: StepperType;
};

function ShowRangeResultsLive({ start, end, stepper }: RangeLiveProps) {
  const values: number[] = calculateRangeOutput(start, end, stepper);

  return (
    <div>
      <span className="text-gray-400">Steps used ({values.length})</span>
      <div className="flex flex-wrap gap-2">
        {values.map((step) => (
          <div key={step} className="px-2 py-1 border text-gray-400 rounded text-center">
            {round(step, 2)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RangeParameter({ paramAtom, className, onChangeParamType }: Props) {
  const [data, setData] = useAtom(paramAtom);
  const [isExpanded, setIsExpanded] = useState(false);

  const { min, max, start, end, step } = data.value;

  const initialMarks: SliderMarks = {
    [min]: min,
    [max]: max,
    [start]: start,
    [end]: end,
  };
  const [marks, setMarks] = useState<SliderMarks>(initialMarks);

  const [[startValue, endValue], setStartEndValues] = useState<[number, number]>([start, end]);

  const genExtra = () => <ImportOutlined onClick={onChangeParamType} />;

  const onSliderChange = ([newStart, newEnd]: number[]) => {
    // increase max when end reaches max value
    const newMax = newEnd === max ? round(max * 1.5, 2) : max;
    setMarks({
      [min]: min,
      [max]: newMax,
      [newStart]: newStart,
      [newEnd]: newEnd,
    });
    setStartEndValues([newStart, newEnd]);
    setData((oldAtomData) => ({
      ...oldAtomData,
      value: {
        ...oldAtomData.value,
        start: newStart,
        end: newEnd,
        max: newMax,
      },
    }));
  };

  const onStepperChange = useCallback(
    (newStepper: StepperType) => {
      setData((oldAtomData) => ({
        ...oldAtomData,
        value: {
          ...oldAtomData.value,
          stepper: newStepper,
        },
      }));
    },
    [setData]
  );

  const borderStyle = 'border-2 border-solid border-gray rounded-md';
  const titleStyle = 'font-bold text-primary-7';

  const collapseTitle = isExpanded ? (
    <div className={titleStyle}>{data.name}</div>
  ) : (
    <div className="flex items-baseline">
      <div className={classNames('w-[100px]', titleStyle)}>{data.name}</div>
      <div className="text-xs text-primary-7">
        Range {startValue} - {endValue}
      </div>
    </div>
  );

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: collapseTitle,
      extra: genExtra(),
      children: (
        <div className={classNames(borderStyle, 'p-2')}>
          <div>
            RANGE
            <span className="text-gray-400 px-2">{data.unit}</span>
          </div>
          <div className="mb-14 mx-3">
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
          </div>

          <ShowRangeResultsLive start={start} end={end} stepper={data.value.stepper} />

          <div className="mt-5">STEPPER</div>
          <Stepper data={data} onChange={onStepperChange} />
        </div>
      ),
    },
  ];

  return (
    <Collapse
      expandIconPosition="end"
      ghost
      className={className}
      onChange={() => setIsExpanded((old) => !old)}
      items={items}
    />
  );
}
