'use client';

import { useState } from 'react';
import { Slider, Collapse } from 'antd';
import { ImportOutlined } from '@ant-design/icons';
import type { SliderMarks } from 'antd/es/slider';

import Stepper from './Stepper';
import type { ExpDesignerRangeParameter } from '@/types/experiment-designer';
import { classNames } from '@/util/utils';

const { Panel } = Collapse;

type Props = {
  data: ExpDesignerRangeParameter;
  className?: string;
};

export default function RangeParameter({ data, className }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { min: minStr, max: maxStr, start: startStr, end: endStr, step: stepStr } = data.value;
  const [min, max, defaultStart, defaultEnd, step] = [
    parseFloat(minStr) || 0,
    parseFloat(maxStr) || 100,
    parseFloat(startStr) || 0,
    parseFloat(endStr) || 100,
    parseFloat(stepStr) || 1,
  ];

  const initialMarks: SliderMarks = {
    [min]: min,
    [max]: max,
    [defaultStart]: defaultStart,
    [defaultEnd]: defaultEnd,
  };
  const [marks, setMarks] = useState<SliderMarks>(initialMarks);

  const [[startValue, endValue], setStartEndValues] = useState<[number, number]>([
    defaultStart,
    defaultEnd,
  ]);

  const genExtra = () => (
    <ImportOutlined
      onClick={(event) => {
        // If you don't want click extra trigger collapse, you can prevent this:
        event.stopPropagation();
      }}
    />
  );

  const onSliderChange = ([newStart, newEnd]: [number, number]) => {
    setMarks({
      [min]: min,
      [max]: max,
      [newStart]: newStart,
      [newEnd]: newEnd,
    });
    setStartEndValues([newStart, newEnd]);
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
          <div>RANGE</div>
          <div className="mb-14">
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
