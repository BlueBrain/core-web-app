'use client';

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
  const { min: minStr, max: maxStr, start: startStr, end: endStr, step: stepStr } = data.value;
  const [min, max, start, end, step] = [
    parseFloat(minStr) || 0,
    parseFloat(maxStr) || 100,
    parseFloat(startStr) || 0,
    parseFloat(endStr) || 100,
    parseFloat(stepStr) || 1,
  ];

  const marks: SliderMarks = {
    [min]: min,
    [max]: max,
  };

  const genExtra = () => (
    <ImportOutlined
      onClick={(event) => {
        // If you don't want click extra trigger collapse, you can prevent this:
        event.stopPropagation();
      }}
    />
  );

  const borderStyle = 'border-2 border-solid border-gray rounded-md';

  return (
    <Collapse expandIconPosition="end" ghost className={className} defaultActiveKey={['1']}>
      <Panel header={data.name} key="1" extra={genExtra()}>
        <div className={classNames(borderStyle, 'p-2')}>
          <div>RANGE</div>
          <div className="mb-14">
            <Slider
              range
              min={min}
              max={max}
              step={step}
              defaultValue={[start, end]}
              marks={marks}
              tooltip={{ open: true, placement: 'bottom' }}
            />
          </div>

          <div>STEPPER</div>
          <Stepper data={data} className={borderStyle} />
        </div>
      </Panel>
    </Collapse>
  );
}
