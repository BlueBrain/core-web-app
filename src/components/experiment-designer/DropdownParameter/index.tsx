'use client';

import { Select } from 'antd';
import { ExportOutlined } from '@ant-design/icons';

import type { ExpDesignerDropdownParameter } from '@/types/experiment-designer';
import { classNames } from '@/util/utils';

type Props = {
  data: ExpDesignerDropdownParameter;
  className?: string;
  showSwitcher?: boolean;
};

export default function DropdownParameter({ data, className, showSwitcher = true }: Props) {
  const options = data.options?.length ? data.options : [{ label: data.value, value: data.value }];

  return (
    <div className={classNames('flex gap-3 items-center font-bold', className)}>
      <div className="grow">{data.name}</div>
      <Select defaultValue={[data.value]} size="small" options={options} style={{ width: 200 }} />
      {showSwitcher && <ExportOutlined />}
    </div>
  );
}
