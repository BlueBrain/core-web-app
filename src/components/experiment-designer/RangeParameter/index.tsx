'use client';

import { useState } from 'react';
import { Slider, Collapse } from 'antd';
import { ImportOutlined } from '@ant-design/icons';
import type { SliderMarks } from 'antd/es/slider';
import { PrimitiveAtom, useAtom } from 'jotai';
import round from 'lodash/round';

import Stepper from './Stepper';
import type { ExpDesignerRangeParameter } from '@/types/experiment-designer';
import { classNames } from '@/util/utils';

const { Panel } = Collapse;

type Props = {
  paramAtom: PrimitiveAtom<ExpDesignerRangeParameter>;
  className?: string;
  onChangeParamType?: () => void;
};

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

  const onSliderChange = ([newStart, newEnd]: [number, number]) => {
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

  return (
    <Collapse
      expandIconPosition="end"
      ghost
      className={className}
      onChange={() => setIsExpanded((old) => !old)}
    >
      <Panel header={collapseTitle} key="1" extra={genExtra()}>
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

          <div>STEPPER</div>
          <Stepper data={data} className={borderStyle} />
        </div>
      </Panel>
    </Collapse>
  );
}
