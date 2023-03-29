'use client';

import { Select } from 'antd';
import { ExportOutlined } from '@ant-design/icons';

import type { ExpDesignerStringParameter } from '@/types/experiment-designer';
import { classNames } from '@/util/utils';

type Props = {
  data: ExpDesignerStringParameter;
  className?: string;
};

export default function StringParameter({ data, className }: Props) {
  // TODO: add other regions. This will impact the viewer
  const options = [{ label: data.value, value: data.value }];

  return (
    <div className={classNames('flex gap-3 items-center', className)}>
      <div className="grow">{data.name}</div>
      <Select defaultValue={[data.value]} size="small" options={options} style={{ width: 200 }} />
      <ExportOutlined />
    </div>
  );
}
