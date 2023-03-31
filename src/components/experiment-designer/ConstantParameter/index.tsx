'use client';

import { InputNumber } from 'antd';
import { ExportOutlined } from '@ant-design/icons';

import type { ExpDesignerNumberParameter } from '@/types/experiment-designer';
import { classNames } from '@/util/utils';

type Props = {
  data: ExpDesignerNumberParameter;
  className?: string;
};

export default function ConstantParameter({ data, className }: Props) {
  return (
    <div className={classNames('flex gap-3', className)}>
      <div className="grow font-bold">{data.name}</div>
      <InputNumber
        defaultValue={data.value}
        addonAfter={data.unit}
        size="small"
        style={{ width: 100 }}
      />
      <ExportOutlined />
    </div>
  );
}
