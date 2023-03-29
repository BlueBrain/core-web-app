'use client';

import { InputNumber } from 'antd';
import { ExportOutlined } from '@ant-design/icons';

import type { ExpDesignerNumberParameter } from '@/types/experiment-designer';

type Props = {
  data: ExpDesignerNumberParameter;
};

export default function ConstantParameter({ data }: Props) {
  return (
    <div className="flex gap-3">
      <div className="grow">{data.name}</div>
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
