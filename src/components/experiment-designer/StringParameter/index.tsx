'use client';

import { Input } from 'antd';
import { ExportOutlined } from '@ant-design/icons';

import type { ExpDesignerStringParameter } from '@/types/experiment-designer';
import { classNames } from '@/util/utils';

type Props = {
  data: ExpDesignerStringParameter;
  className?: string;
};

export default function StringParameter({ data, className }: Props) {
  return (
    <div className={classNames('flex items-center gap-3 font-bold', className)}>
      <div className="grow">{data.name}</div>
      <Input defaultValue={data.value} size="small" style={{ width: 200 }} />
      <ExportOutlined />
    </div>
  );
}
